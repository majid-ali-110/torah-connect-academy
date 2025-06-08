
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

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) throw new Error("User not authenticated");

    const { courseId, isLiveClass = false } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get course/live class details
    let courseData;
    if (isLiveClass) {
      const { data: liveClass } = await supabaseClient
        .from('live_classes')
        .select('*, teacher:profiles!teacher_id(first_name, last_name)')
        .eq('id', courseId)
        .single();
      courseData = liveClass;
    } else {
      const { data: course } = await supabaseClient
        .from('courses')
        .select('*, teacher:profiles!teacher_id(first_name, last_name)')
        .eq('id', courseId)
        .single();
      courseData = course;
    }

    if (!courseData) throw new Error("Course not found");

    // Check if already enrolled
    const enrollmentTable = isLiveClass ? 'live_class_enrollments' : 'course_enrollments';
    const enrollmentColumn = isLiveClass ? 'live_class_id' : 'course_id';
    
    const { data: existingEnrollment } = await supabaseClient
      .from(enrollmentTable)
      .select('id')
      .eq('student_id', user.id)
      .eq(enrollmentColumn, courseId)
      .single();

    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }

    // Check if course is free
    if (courseData.is_free || courseData.price === 0) {
      // Create free enrollment
      const { error: enrollError } = await supabaseClient
        .from(enrollmentTable)
        .insert({
          student_id: user.id,
          [enrollmentColumn]: courseId,
          payment_id: null
        });

      if (enrollError) throw enrollError;

      return new Response(JSON.stringify({ success: true, free: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create payment for paid courses
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: courseData.currency || "eur",
            product_data: {
              name: courseData.title,
              description: `${isLiveClass ? 'Live Class' : 'Course'} by ${courseData.teacher?.first_name} ${courseData.teacher?.last_name}`,
            },
            unit_amount: courseData.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/courses`,
      metadata: {
        courseId: courseId,
        userId: user.id,
        isLiveClass: isLiveClass.toString()
      }
    });

    // Store payment record
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        amount: courseData.price,
        currency: courseData.currency || "eur",
        stripe_payment_intent_id: session.id,
        status: 'pending'
      });

    if (paymentError) throw paymentError;

    return new Response(JSON.stringify({ url: session.url }), {
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
