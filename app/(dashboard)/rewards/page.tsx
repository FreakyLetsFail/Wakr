"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Gift, 
  Star, 
  Lock,
  CheckCircle,
  Coins,
  Award,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  requirementType: string;
  requirementValue: number;
  currentProgress?: number;
  coinReward: number;
  xpReward: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlockedAt?: string;
  seen?: boolean;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  category: string;
  coinCost: number;
  icon: string;
  available: boolean;
  subscriptionTierRequired?: string;
  userRedeemed?: boolean;
}

interface UserCoins {
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const TIER_COLORS = {
  bronze: "bg-amber-600",
  silver: "bg-gray-500",
  gold: "bg-yellow-500",
  platinum: "bg-purple-600"
};

export default function RewardsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userCoins, setUserCoins] = useState<UserCoins | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [achievementsRes, rewardsRes, coinsRes] = await Promise.all([
        fetch('/api/achievements'),
        fetch('/api/rewards'),
        fetch('/api/coins')
      ]);

      if (achievementsRes.ok) {
        const data = await achievementsRes.json();
        setAchievements(data.achievements || []);
      }

      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRewards(data.rewards || []);
      }

      if (coinsRes.ok) {
        const data = await coinsRes.json();
        setUserCoins(data.coins);
      }
    } catch (error) {
      console.error('Error fetching rewards data:', error);
      toast({
        title: "Error",
        description: "Failed to load rewards data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId: string, coinCost: number) => {
    if (!userCoins || userCoins.currentBalance < coinCost) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${coinCost} coins to redeem this reward`,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success! 🎉",
          description: "Reward redeemed successfully",
        });
        fetchData(); // Refresh data
      } else {
        throw new Error('Failed to redeem reward');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Rewards & Achievements</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Earn coins and unlock rewards for your progress
          </p>
        </div>
        {userCoins && (
          <div className="flex items-center gap-4">
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <Coins className="w-5 h-5 text-yellow-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{userCoins.currentBalance}</p>
                  <p className="text-xs text-muted-foreground">Coins</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* User Stats */}
      {userCoins && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-lg font-bold">{userCoins.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">XP</p>
                  <p className="text-lg font-bold">{userCoins.xp}/{userCoins.xpToNextLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Earned</p>
                  <p className="text-lg font-bold">{userCoins.totalEarned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Spent</p>
                  <p className="text-lg font-bold">{userCoins.totalSpent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Shop</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Unlocked ({unlockedAchievements.length})</h2>
            {unlockedAchievements.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No achievements unlocked yet. Keep going!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {unlockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="border-l-4" style={{borderLeftColor: TIER_COLORS[achievement.tier].replace('bg-', '#')}}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className={TIER_COLORS[achievement.tier]}>
                                {achievement.tier.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                +{achievement.coinReward} coins • +{achievement.xpReward} XP
                              </span>
                            </div>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Locked ({lockedAchievements.length})</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {lockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl grayscale">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">
                              {achievement.currentProgress || 0}/{achievement.requirementValue}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              +{achievement.coinReward} coins • +{achievement.xpReward} XP
                            </span>
                          </div>
                        </div>
                      </div>
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Rewards Shop Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid gap-4">
            {rewards.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No rewards available at the moment
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rewards.map((reward) => (
                  <Card key={reward.id} className={!reward.available ? "opacity-50" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{reward.icon}</div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold">{reward.coinCost}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {reward.subscriptionTierRequired && (
                        <Badge variant="outline" className="mb-3">
                          {reward.subscriptionTierRequired} tier required
                        </Badge>
                      )}
                      <Button
                        className="w-full"
                        disabled={!reward.available || reward.userRedeemed || (userCoins?.currentBalance || 0) < reward.coinCost}
                        onClick={() => redeemReward(reward.id, reward.coinCost)}
                      >
                        {reward.userRedeemed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Redeemed
                          </>
                        ) : !reward.available ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Unavailable
                          </>
                        ) : (userCoins?.currentBalance || 0) < reward.coinCost ? (
                          <>
                            <Coins className="w-4 h-4 mr-2" />
                            Need {reward.coinCost - (userCoins?.currentBalance || 0)} more
                          </>
                        ) : (
                          <>
                            <Gift className="w-4 h-4 mr-2" />
                            Redeem
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}