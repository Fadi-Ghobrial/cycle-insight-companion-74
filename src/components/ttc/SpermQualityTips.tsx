
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const SpermQualityTips: React.FC = () => {
  const tips = [
    {
      category: "Nutrition & Diet",
      items: [
        {
          title: "Antioxidant-Rich Foods",
          description: "Consume foods high in antioxidants like vitamin C, vitamin E, and selenium. Research suggests these nutrients may improve sperm quality. Examples include berries, citrus fruits, nuts, and leafy greens.",
          evidence: "Meta-analyses show antioxidant supplements may improve sperm parameters in subfertile men (Cochrane Review, 2019)."
        },
        {
          title: "Omega-3 Fatty Acids",
          description: "Include fatty fish like salmon, mackerel, and sardines in your diet. Omega-3s may improve sperm count and motility.",
          evidence: "Studies show a positive association between omega-3 intake and sperm quality parameters (Asian Journal of Andrology, 2020)."
        },
        {
          title: "Zinc and Folate",
          description: "These nutrients support healthy sperm production. Oysters, beef, pumpkin seeds, and lentils are good sources of zinc. Leafy greens, beans, and fortified grains provide folate.",
          evidence: "Zinc deficiency has been linked to decreased testosterone levels and sperm count (Journal of Reproduction & Infertility, 2018)."
        },
        {
          title: "Moderate Alcohol",
          description: "Limit alcohol consumption to no more than 1-2 drinks per day. Excessive alcohol can impair sperm production and quality.",
          evidence: "Heavy alcohol use is associated with decreased sperm parameters (Andrologia, 2017)."
        }
      ]
    },
    {
      category: "Lifestyle Factors",
      items: [
        {
          title: "Maintain Healthy Weight",
          description: "Both overweight and underweight conditions can affect hormone levels and sperm production. Aim for a BMI between 18.5-24.9.",
          evidence: "Multiple studies show that obesity is associated with reduced sperm quality (Human Reproduction Update, 2018)."
        },
        {
          title: "Regular Exercise",
          description: "Moderate exercise can improve sperm quality by reducing oxidative stress and improving hormone profiles. However, avoid excessive or extremely intense exercise.",
          evidence: "Moderate physical activity is associated with better semen parameters compared to sedentary lifestyle or excessive exercise (Reproduction, 2017)."
        },
        {
          title: "Avoid Overheating",
          description: "Sperm production requires temperatures slightly lower than body temperature. Avoid hot tubs, saunas, and placing laptops directly on your lap for extended periods.",
          evidence: "Scrotal hyperthermia can negatively affect spermatogenesis (Asian Journal of Andrology, 2015)."
        },
        {
          title: "Quit Smoking",
          description: "Tobacco use is linked to reduced sperm count, motility, and abnormal morphology. Smoking cessation can improve sperm parameters.",
          evidence: "Smoking is associated with a 13-17% reduction in sperm concentration (Human Reproduction Update, 2016)."
        }
      ]
    },
    {
      category: "Environmental Factors",
      items: [
        {
          title: "Minimize Toxin Exposure",
          description: "Reduce exposure to environmental toxins like pesticides, heavy metals, and industrial chemicals, which can act as endocrine disruptors.",
          evidence: "Occupational exposure to chemicals is associated with decreased semen quality (Fertility and Sterility, 2021)."
        },
        {
          title: "Avoid Tight Underwear",
          description: "Wear loose-fitting underwear to maintain optimal scrotal temperature. Boxer shorts may be better than briefs for some men.",
          evidence: "Men who primarily wear boxers have higher sperm concentration than men who wear tighter underwear (Human Reproduction, 2018)."
        },
        {
          title: "Reduce Plastic Exposure",
          description: "Minimize use of plastics containing BPA and phthalates, which may act as endocrine disruptors. Use glass or stainless steel containers when possible.",
          evidence: "Higher urinary BPA levels are associated with lower sperm concentration (Fertility and Sterility, 2015)."
        }
      ]
    },
    {
      category: "Timing & Frequency",
      items: [
        {
          title: "Optimal Intercourse Frequency",
          description: "For conception, having intercourse every 2-3 days throughout the cycle is generally recommended, with slightly increased frequency during the fertile window.",
          evidence: "Daily ejaculation may reduce sperm count per ejaculate but doesn't typically reduce fertility potential (Fertility and Sterility, 2016)."
        },
        {
          title: "Avoid Extended Abstinence",
          description: "While brief abstinence (2-3 days) may slightly increase sperm count, longer periods can reduce sperm quality. Regular ejaculation helps maintain sperm health.",
          evidence: "Sperm motility and morphology may decline after 7 days of abstinence (Systems Biology in Reproductive Medicine, 2018)."
        }
      ]
    },
    {
      category: "Stress Management",
      items: [
        {
          title: "Manage Psychological Stress",
          description: "Chronic stress can affect hormone levels and sperm production. Practice stress reduction techniques like meditation, yoga, or deep breathing exercises.",
          evidence: "Stress hormones like cortisol may suppress testosterone and sperm production (Journal of Endocrinology, 2020)."
        },
        {
          title: "Prioritize Sleep",
          description: "Aim for 7-8 hours of quality sleep per night. Sleep deprivation can affect hormone levels including testosterone.",
          evidence: "Restricted sleep is associated with reduced testosterone levels in healthy young men (JAMA, 2011)."
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sperm Quality Tips</CardTitle>
        <CardDescription>
          Evidence-based advice to optimize sperm quality and enhance conception odds
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm">
              Improving sperm quality takes time. Many of the interventions below need 2-3 months to show results, 
              as it takes approximately 74 days to produce new sperm. For best results, consistently follow 
              these evidence-based recommendations while trying to conceive.
            </p>
          </div>
          
          {/* Tips by category */}
          <Accordion type="multiple" defaultValue={["Nutrition & Diet"]}>
            {tips.map((category, index) => (
              <AccordionItem key={index} value={category.category}>
                <AccordionTrigger className="font-medium text-base">
                  {category.category}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    {category.items.map((tip, tipIndex) => (
                      <div key={tipIndex} className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-2">{tip.title}</h4>
                        <p className="text-sm text-gray-700 mb-2">{tip.description}</p>
                        <p className="text-xs text-gray-500 italic">
                          <span className="font-medium">Research Note:</span> {tip.evidence}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {/* Consultation reminder */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <p className="text-sm">
                <span className="font-medium">Important:</span> While these tips can help optimize sperm quality, 
                if you've been trying to conceive for over a year (or 6 months if over 35), 
                consult a healthcare provider specializing in fertility. Many fertility issues 
                are treatable with appropriate medical intervention.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
