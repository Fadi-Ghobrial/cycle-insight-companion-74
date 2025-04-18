
import { ConfidenceMeter } from "@/components/ui/confidence-meter";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Award, Trophy } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Checkbox } from "@/components/ui/checkbox";

export default function MilestonesPage() {
  const { cycleDays } = useAppStore();
  
  // Count the number of logged days
  const daysLogged = cycleDays.length;
  
  // Calculate streaks (consecutive days with entries)
  const calculateLongestStreak = () => {
    if (cycleDays.length === 0) return 0;
    
    let currentStreak = 1;
    let maxStreak = 1;
    
    // Sort days by date
    const sortedDays = [...cycleDays].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    for (let i = 1; i < sortedDays.length; i++) {
      const prevDate = new Date(sortedDays[i-1].date);
      const currDate = new Date(sortedDays[i].date);
      
      // Check if dates are consecutive
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  };
  
  const longestStreak = calculateLongestStreak();
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Journey Milestones</h1>
        
        <div className="max-w-xl mx-auto space-y-6">
          <ConfidenceMeter />
          
          {/* Logging Streak Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Logging Streak</CardTitle>
              <Calendar className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current streak</p>
                  <p className="text-2xl font-bold">{longestStreak} days</p>
                </div>
                <Badge variant="outline" className="bg-purple-50">
                  {longestStreak >= 7 ? "Impressive!" : "Keep going!"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Total Days Logged */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Total Days Logged</CardTitle>
              <Trophy className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your progress</p>
                  <p className="text-2xl font-bold">{daysLogged} days</p>
                </div>
                <Badge variant="outline" className="bg-purple-50">
                  {daysLogged >= 30 ? "Expert tracker!" : "Building habits"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Learning Journey */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Learning Journey</CardTitle>
              <Star className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="article1" checked={true} />
                  <label htmlFor="article1" className="text-sm">Completed "Period Basics"</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="article2" checked={true} />
                  <label htmlFor="article2" className="text-sm">Completed "Understanding Your Cycle"</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="article3" />
                  <label htmlFor="article3" className="text-sm">Read "Hormones and You"</label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Achievement Badges */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Achievement Badges</CardTitle>
              <Award className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500">First Period Logged</Badge>
                {daysLogged >= 7 && <Badge className="bg-pink-500">Week Warrior</Badge>}
                {daysLogged >= 30 && <Badge className="bg-indigo-500">Month Master</Badge>}
                {longestStreak >= 3 && <Badge className="bg-blue-500">3-Day Streak</Badge>}
                {longestStreak >= 7 && <Badge className="bg-green-500">7-Day Streak</Badge>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
