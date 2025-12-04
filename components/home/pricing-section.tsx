// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Check, Sparkles, Zap, Crown } from "lucide-react";

// const pricingPlans = [
//     {
//         name: "Free",
//         price: "$0",
//         description: "Perfect for trying out AI podcasts",
//         icon: Sparkles,
//         features: [
//             "5 AI-generated podcasts per month",
//             "Basic voice selection",
//             "Standard audio quality",
//             "Community support",
//             "Basic analytics",
//         ],
//         notIncluded: [
//             "Custom voice cloning",
//             "Priority processing",
//             "Advanced analytics",
//         ],
//         gradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
//         borderGradient: "from-emerald-500 via-teal-500 to-cyan-500",
//         iconColor: "text-emerald-600",
//         buttonVariant: "outline" as const,
//     },
//     {
//         name: "Pro",
//         price: "$29",
//         description: "For serious podcast creators",
//         icon: Zap,
//         popular: true,
//         features: [
//             "Unlimited AI-generated podcasts",
//             "Premium voice library (50+ voices)",
//             "HD audio quality",
//             "Priority processing",
//             "Advanced analytics & insights",
//             "Custom voice cloning (3 voices)",
//             "API access",
//             "Priority support",
//         ],
//         notIncluded: [],
//         gradient: "from-emerald-500/20 via-teal-500/20 to-emerald-600/20",
//         borderGradient: "from-emerald-500 via-teal-500 to-emerald-600",
//         iconColor: "text-emerald-600",
//         buttonVariant: "default" as const,
//     },
//     {
//         name: "Enterprise",
//         price: "Custom",
//         description: "For teams and organizations",
//         icon: Crown,
//         features: [
//             "Everything in Pro",
//             "Unlimited voice cloning",
//             "White-label solution",
//             "Custom integrations",
//             "Dedicated account manager",
//             "SLA guarantee",
//             "Advanced security features",
//             "Custom contract terms",
//         ],
//         notIncluded: [],
//         gradient: "from-teal-500/10 via-emerald-500/10 to-green-500/10",
//         borderGradient: "from-teal-500 via-emerald-500 to-green-500",
//         iconColor: "text-teal-600",
//         buttonVariant: "outline" as const,
//     },
// ];

// export default function PricingSection() {
//     return (
//         <section className="py-24 px-4 relative overflow-hidden">
//             {/* Background decoration */}
//             <div className="absolute inset-0 -z-10 overflow-hidden">
//                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
//                 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
//             </div>

//             <div className="max-w-7xl mx-auto">
//                 {/* Section Header */}
//                 <div className="text-center mb-16 space-y-4">
//                     <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
//                         Pricing Plans
//                     </Badge>
//                     <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
//                         Choose Your Perfect Plan
//                     </h2>
//                     <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//                         Start for free, upgrade when you need more. All plans include our core AI podcast features.
//                     </p>
//                 </div>

//                 {/* Pricing Cards */}
//                 <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
//                     {pricingPlans.map((plan) => {
//                         const Icon = plan.icon;
//                         return (
//                             <div
//                                 key={plan.name}
//                                 className={`relative group ${plan.popular ? 'md:-mt-4' : ''}`}
//                             >
//                                 {/* Popular Badge */}
//                                 {plan.popular && (
//                                     <div className="absolute -top-5 left-0 right-0 flex justify-center z-10">
//                                         <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 px-4 py-1 shadow-lg">
//                                             ⭐ Most Popular
//                                         </Badge>
//                                     </div>
//                                 )}

//                                 <Card
//                                     className={`relative h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.popular
//                                         ? 'border-2 shadow-xl scale-105 md:scale-110'
//                                         : 'hover:border-primary/50'
//                                         }`}
//                                 >
//                                     {/* Gradient Border Effect */}
//                                     <div
//                                         className={`absolute inset-0 rounded-lg bg-gradient-to-br ${plan.borderGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur`}
//                                     />

//                                     {/* Gradient Background */}
//                                     <div
//                                         className={`absolute inset-0 rounded-lg bg-gradient-to-br ${plan.gradient} opacity-50`}
//                                     />

//                                     <CardHeader className="relative space-y-4 pb-8">
//                                         <div className="flex items-center justify-between">
//                                             <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} border`}>
//                                                 <Icon className={`w-6 h-6 ${plan.iconColor}`} />
//                                             </div>
//                                             {plan.popular && (
//                                                 <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
//                                             )}
//                                         </div>
//                                         <div>
//                                             <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
//                                             <CardDescription className="text-base">
//                                                 {plan.description}
//                                             </CardDescription>
//                                         </div>
//                                         <div className="flex items-baseline gap-1">
//                                             <span className="text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
//                                                 {plan.price}
//                                             </span>
//                                             {plan.price !== "Custom" && (
//                                                 <span className="text-muted-foreground">/month</span>
//                                             )}
//                                         </div>
//                                     </CardHeader>

//                                     <CardContent className="relative space-y-4">
//                                         <ul className="space-y-3">
//                                             {plan.features.map((feature, index) => (
//                                                 <li key={index} className="flex items-start gap-3">
//                                                     <div className="mt-0.5 p-1 rounded-full bg-green-500/10">
//                                                         <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
//                                                     </div>
//                                                     <span className="text-sm leading-relaxed">{feature}</span>
//                                                 </li>
//                                             ))}
//                                             {plan.notIncluded.map((feature, index) => (
//                                                 <li key={`not-${index}`} className="flex items-start gap-3 opacity-40">
//                                                     <div className="mt-0.5 p-1 rounded-full">
//                                                         <Check className="w-4 h-4 flex-shrink-0" />
//                                                     </div>
//                                                     <span className="text-sm leading-relaxed line-through">
//                                                         {feature}
//                                                     </span>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </CardContent>

//                                     <CardFooter className="relative pt-6">
//                                         <Button
//                                             variant={plan.buttonVariant}
//                                             className={`w-full ${plan.popular
//                                                 ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-lg'
//                                                 : ''
//                                                 }`}
//                                             size="lg"
//                                         >
//                                             {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
//                                         </Button>
//                                     </CardFooter>
//                                 </Card>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* Bottom CTA */}
//                 <div className="mt-16 text-center">
//                     <p className="text-muted-foreground">
//                         All plans include a 14-day free trial. No credit card required.{" "}
//                         <a href="#" className="text-primary hover:underline font-medium">
//                             Compare plans in detail →
//                         </a>
//                     </p>
//                 </div>
//             </div>
//         </section>
//     );
// }


import { PricingTable } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface PricingSectionProps {
    compact?: boolean;
}

export function PricingSection({ compact = false }: PricingSectionProps) {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 mesh-background-subtle"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Simple, <span className="gradient-emerald-text">Transparent</span> Pricing
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Choose the plan that fits your needs. Upgrade, downgrade, or cancel anytime.
                        </p>
                    </div>

                    {/* Pricing Table */}
                    <div className="flex justify-center w-full">
                        <div className={compact ? "max-w-4xl w-full" : "max-w-5xl w-full"}>
                            <PricingTable
                                appearance={{
                                    elements: {
                                        pricingTableCardHeader: {
                                            background: "linear-gradient(135deg, rgb(16 185 129), rgb(45 212 191))",
                                            color: "white",
                                            borderRadius: "1rem 1rem 0 0",
                                            padding: compact ? "2rem" : "2.5rem",
                                        },
                                        pricingTableCardTitle: {
                                            fontSize: compact ? "1.75rem" : "2.25rem",
                                            fontWeight: "800",
                                            color: "white",
                                            marginBottom: "0.5rem",
                                        },
                                        pricingTableCardDescription: {
                                            fontSize: compact ? "0.95rem" : "1.1rem",
                                            color: "rgba(255, 255, 255, 0.95)",
                                            fontWeight: "500",
                                        },
                                        pricingTableCardFee: {
                                            color: "white",
                                            fontWeight: "800",
                                            fontSize: compact ? "2.5rem" : "3rem",
                                        },
                                        pricingTableCardFeePeriod: {
                                            color: "rgba(255, 255, 255, 0.85)",
                                            fontSize: "1.1rem",
                                        },
                                        pricingTableCard: {
                                            borderRadius: "1rem",
                                            border: "2px solid rgb(16 185 129 / 0.2)",
                                            boxShadow: "0 10px 40px rgba(16, 185, 129, 0.15)",
                                            transition: "all 0.3s ease",
                                            overflow: "hidden",
                                            background: "rgba(255, 255, 255, 0.9)",
                                            backdropFilter: "blur(10px)",
                                        },
                                        pricingTableCardBody: {
                                            padding: compact ? "2rem" : "2.5rem",
                                        },
                                        pricingTableCardFeatures: {
                                            marginTop: "2rem",
                                            gap: "1rem",
                                        },
                                        pricingTableCardFeature: {
                                            fontSize: compact ? "0.95rem" : "1.05rem",
                                            padding: "0.75rem 0",
                                            fontWeight: "500",
                                        },
                                        pricingTableCardButton: {
                                            marginTop: "2rem",
                                            borderRadius: "0.75rem",
                                            fontWeight: "700",
                                            padding: "1rem 2.5rem",
                                            transition: "all 0.2s ease",
                                            fontSize: "1.1rem",
                                            background: "linear-gradient(135deg, rgb(16 185 129), rgb(45 212 191))",
                                            border: "none",
                                            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                                        },
                                    },
                                }}
                                fallback={
                                    <div className="flex items-center justify-center py-20">
                                        <div className="text-center space-y-4 glass-card p-12 rounded-2xl">
                                            <Loader2 className="h-16 w-16 animate-spin text-emerald-600 mx-auto" />
                                            <p className="text-gray-600 text-lg font-medium">Loading pricing options...</p>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

