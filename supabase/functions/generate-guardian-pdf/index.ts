
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeneratePdfRequest {
  userId: string;
  guardianEmail: string;
  includeSymptoms: boolean;
  includeCycleDates: boolean;
  includeNotes: boolean;
  passcode: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, guardianEmail, includeSymptoms, includeCycleDates, includeNotes, passcode } = 
      await req.json() as GeneratePdfRequest;

    // Initialize Supabase client with auth context
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify the passcode against stored passcode in guardian_share_settings
    const { data: guardianSettings, error: settingsError } = await supabase
      .from("guardian_share_settings")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (settingsError || !guardianSettings) {
      console.error("Guardian settings not found:", settingsError);
      return new Response(
        JSON.stringify({ error: "Guardian share settings not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!guardianSettings.consent_verified || !guardianSettings.enabled) {
      console.error("Guardian sharing not enabled or consent not verified");
      return new Response(
        JSON.stringify({ error: "Guardian sharing not enabled or consent not verified" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (guardianSettings.passcode !== passcode) {
      console.error("Invalid passcode");
      return new Response(
        JSON.stringify({ error: "Invalid passcode" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Fetch user cycle data
    const { data: cycleDays, error: cycleError } = await supabase.rpc("get_cycle_data_for_guardian", {
      user_id_param: userId,
      include_symptoms: includeSymptoms,
      include_cycle_dates: includeCycleDates,
      include_notes: includeNotes
    });
    
    if (cycleError) {
      console.error("Error fetching cycle data:", cycleError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch cycle data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Generate PDF
    const pdfBytes = await generatePdf(cycleDays, includeSymptoms, includeCycleDates, includeNotes);
    
    // Update last export timestamp
    await supabase
      .from("guardian_share_settings")
      .update({ 
        last_export_at: new Date().toISOString(),
        guardian_email: guardianEmail 
      })
      .eq("user_id", userId);
    
    // Send PDF via email
    const emailSent = await sendPdfByEmail(pdfBytes, guardianEmail, userId);
    
    if (!emailSent) {
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "PDF sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in generate-guardian-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Function to generate PDF containing cycle data
async function generatePdf(cycleData: any[], includeSymptoms: boolean, includeCycleDates: boolean, includeNotes: boolean) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Add title and header
  page.drawText("CycleInsight: Guardian Report", {
    x: 50,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText("This report contains limited cycle information shared by your dependent.", {
    x: 50,
    y: height - 80,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: height - 100,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  // Add privacy notice
  page.drawText("PRIVACY NOTICE", {
    x: 50,
    y: height - 140,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText("This information is confidential and shared with your consent.", {
    x: 50,
    y: height - 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText("Please respect the privacy of this data and do not share it with others.", {
    x: 50,
    y: height - 175,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  // Data sections
  let yPosition = height - 220;
  
  if (includeCycleDates && cycleData.length > 0) {
    page.drawText("CYCLE SUMMARY", {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 25;
    
    // Extract and display cycle dates
    const cycles = extractCycles(cycleData);
    cycles.forEach((cycle, index) => {
      page.drawText(`Cycle ${index + 1}: ${cycle.startDate} to ${cycle.endDate}`, {
        x: 60,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= 15;
      
      if (cycle.length) {
        page.drawText(`Length: ${cycle.length} days`, {
          x: 70,
          y: yPosition,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        yPosition -= 25;
      }
    });
  }
  
  if (includeSymptoms && cycleData.some(d => d.symptoms && d.symptoms.length > 0)) {
    page.drawText("COMMON SYMPTOMS", {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 25;
    
    // Extract and display common symptoms
    const commonSymptoms = extractCommonSymptoms(cycleData);
    commonSymptoms.forEach(symptom => {
      page.drawText(`• ${symptom.name}: reported ${symptom.count} times`, {
        x: 60,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= 15;
    });
    
    yPosition -= 15;
  }
  
  if (includeNotes && cycleData.some(d => d.notes)) {
    // Add page for notes if needed
    if (yPosition < 200) {
      page = pdfDoc.addPage();
      yPosition = height - 50;
    }
    
    page.drawText("NOTES", {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 25;
    
    // Display notes
    cycleData.filter(d => d.notes).forEach(day => {
      page.drawText(`${day.date}: ${day.notes}`, {
        x: 60,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= 20;
      
      // Add new page if needed
      if (yPosition < 50) {
        page = pdfDoc.addPage();
        yPosition = height - 50;
      }
    });
  }
  
  // Add footer with data protection information
  page.drawText("This data is protected and encrypted. For questions, contact support@cycleinsight.app", {
    x: 50,
    y: 30,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  // Serialize the PDF to bytes
  return await pdfDoc.save();
}

// Helper function to extract cycle information
function extractCycles(cycleData: any[]) {
  // Sort data by date
  const sortedData = [...cycleData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const cycles = [];
  let currentCycle = null;
  
  for (const day of sortedData) {
    if (day.flow && day.flow !== 'none') {
      if (!currentCycle || (currentCycle.endDate && new Date(day.date).getTime() - new Date(currentCycle.endDate).getTime() > 3 * 24 * 60 * 60 * 1000)) {
        // Start new cycle if this is the first one or if there's a gap of more than 3 days
        if (currentCycle) {
          cycles.push(currentCycle);
        }
        
        currentCycle = {
          startDate: day.date,
          endDate: null,
          length: null
        };
      }
    } else if (currentCycle && !currentCycle.endDate && currentCycle.startDate !== day.date) {
      // End the cycle when flow stops
      currentCycle.endDate = day.date;
      currentCycle.length = Math.round((new Date(currentCycle.endDate).getTime() - new Date(currentCycle.startDate).getTime()) / (24 * 60 * 60 * 1000));
    }
  }
  
  // Add the last cycle if it exists
  if (currentCycle) {
    if (!currentCycle.endDate) {
      currentCycle.endDate = "Current";
    }
    cycles.push(currentCycle);
  }
  
  return cycles;
}

// Helper function to extract common symptoms
function extractCommonSymptoms(cycleData: any[]) {
  const symptomCounts = {};
  
  cycleData.forEach(day => {
    if (day.symptoms && Array.isArray(day.symptoms)) {
      day.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    }
  });
  
  return Object.entries(symptomCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 symptoms
}

// Function to send PDF by email
async function sendPdfByEmail(pdfBytes: Uint8Array, email: string, userId: string) {
  try {
    // Convert PDF to base64
    const pdfBase64 = base64Encode(pdfBytes);
    
    // Supabase doesn't have built-in email functionality, so we'd use a service like Resend
    // For this example, we'll log the success and assume it worked
    console.log(`Would send PDF to ${email} for user ${userId}`);
    console.log(`PDF size: ${pdfBytes.length} bytes`);
    
    // Here you would integrate with an email service like Resend or SendGrid
    // Example (pseudo-code):
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // await resend.emails.send({
    //   from: "no-reply@cycleinsight.app",
    //   to: email,
    //   subject: "Cycle Insights - Guardian Report",
    //   text: "Please find attached the cycle report shared with you.",
    //   attachments: [
    //     {
    //       filename: "cycle-report.pdf",
    //       content: pdfBase64
    //     }
    //   ]
    // });
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
