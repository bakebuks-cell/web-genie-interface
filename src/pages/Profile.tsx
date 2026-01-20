import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Crown, Zap, Calendar, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';

const planDetails = {
  free: {
    name: 'Free',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
    icon: User,
    credits: '5 daily',
    description: 'Perfect for getting started',
  },
  pro: {
    name: 'Pro',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    icon: Zap,
    credits: 'Unlimited',
    description: 'For power users and creators',
  },
  enterprise: {
    name: 'Enterprise',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    icon: Crown,
    credits: 'Unlimited',
    description: 'For teams and organizations',
  },
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, userCredits, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const currentPlan = planDetails[profile.plan];
  const PlanIcon = currentPlan.icon;
  const isUnlimited = profile.plan !== 'free';
  const creditsDisplay = isUnlimited 
    ? 'Unlimited' 
    : `${userCredits?.credits_remaining ?? 0} / 5`;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
              <p className="text-muted-foreground">Manage your account and subscription</p>
            </div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 space-y-6"
            >
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {profile.display_name || 'DataBuks User'}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Plan Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Current Plan
                </h3>
                
                <div className={`${currentPlan.bgColor} rounded-xl p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PlanIcon className={`w-6 h-6 ${currentPlan.color}`} />
                      <div>
                        <p className={`font-semibold ${currentPlan.color}`}>
                          {currentPlan.name} Plan
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currentPlan.description}
                        </p>
                      </div>
                    </div>
                    {profile.plan === 'free' && (
                      <Button
                        onClick={() => navigate('/pricing')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Credits Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Credits
                </h3>
                
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground">Available Credits</span>
                    <span className={`font-bold text-lg ${isUnlimited ? 'text-primary' : 'text-foreground'}`}>
                      {creditsDisplay}
                    </span>
                  </div>
                  
                  {!isUnlimited && (
                    <>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent-purple"
                          initial={{ width: 0 }}
                          animate={{ width: `${((userCredits?.credits_remaining ?? 0) / 5) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Credits reset daily at midnight (your local time)</span>
                      </div>
                    </>
                  )}
                  
                  {isUnlimited && (
                    <p className="text-sm text-muted-foreground">
                      Enjoy unlimited generations with your {currentPlan.name} plan!
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Account Actions */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
