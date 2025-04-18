import { ConfidenceMeter } from "@/components/ui/confidence-meter";
import Layout from "@/components/layout/Layout";

export default function MilestonesPage() {
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Journey Milestones</h1>
        
        <div className="max-w-xl mx-auto space-y-6">
          <ConfidenceMeter />
          {/* Other milestone components will go here */}
        </div>
      </div>
    </Layout>
  );
}
