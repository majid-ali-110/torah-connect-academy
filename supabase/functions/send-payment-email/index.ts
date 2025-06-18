
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentEmailRequest {
  studentEmail: string;
  courseTitle: string;
  amount: number;
  paymentRequestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentEmail, courseTitle, amount, paymentRequestId }: PaymentEmailRequest = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update payment request to mark email as sent
    const { error: updateError } = await supabaseClient
      .from('payment_requests')
      .update({ 
        email_sent_at: new Date().toISOString() 
      })
      .eq('id', paymentRequestId);

    if (updateError) {
      throw new Error(`Failed to update payment request: ${updateError.message}`);
    }

    // Here you would integrate with your email service (e.g., Resend, SendGrid)
    // For now, we'll just log the email content
    const emailContent = `
      Dear Student,
      
      Thank you for your interest in "${courseTitle}".
      
      To complete your enrollment, please pay €${(amount / 100).toFixed(2)}.
      
      Payment instructions will be provided separately.
      
      Best regards,
      The Teaching Platform Team
    `;

    console.log('Payment email sent to:', studentEmail);
    console.log('Email content:', emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment email sent successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in send-payment-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
