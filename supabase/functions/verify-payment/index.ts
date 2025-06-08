
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const { courseId, userId, isLiveClass } = session.metadata!;

      // Update payment status
      const { error: paymentError } = await supabaseClient
        .from('payments')
        .update({ status: 'completed' })
        .eq('stripe_payment_intent_id', sessionId);

      if (paymentError) throw paymentError;

      // Get the payment record
      const { data: payment } = await supabaseClient
        .from('payments')
        .select('id')
        .eq('stripe_payment_intent_id', sessionId)
        .single();

      // Create enrollment
      const enrollmentTable = isLiveClass === 'true' ? 'live_class_enrollments' : 'course_enrollments';
      const enrollmentColumn = isLiveClass === 'true' ? 'live_class_id' : 'course_id';
      
      const { error: enrollError } = await supabaseClient
        .from(enrollmentTable)
        .insert({
          student_id: userId,
          [enrollmentColumn]: courseId,
          payment_id: payment?.id
        });

      if (enrollError && !enrollError.message.includes('duplicate')) {
        throw enrollError;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ success: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
