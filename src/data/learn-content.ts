
import { Article, ArticleCategory } from '@/types';

// Citation database
export interface Citation {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
}

export const citations: Citation[] = [
  {
    id: "acog-menstruation",
    title: "Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign",
    source: "American College of Obstetricians & Gynecologists",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents-using-the-menstrual-cycle-as-a-vital-sign",
    date: "December 2015 (Reaffirmed 2020)"
  },
  {
    id: "who-statement",
    title: "WHO statement on menstrual health and rights",
    source: "World Health Organization",
    url: "https://www.who.int/news/item/22-06-2022-who-statement-on-menstrual-health-and-rights",
    date: "June 2022"
  },
  {
    id: "figo-aub",
    title: "The FIGO systems for nomenclature and classification of causes of abnormal uterine bleeding",
    source: "International Federation of Gynecology & Obstetrics",
    url: "https://www.figo.org/news/figo-systems-nomenclature-and-classification-causes-abnormal-uterine-bleeding",
    date: "2018"
  },
  {
    id: "cochrane-tens",
    title: "Transcutaneous electrical nerve stimulation for primary dysmenorrhoea",
    source: "Cochrane Library",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002123.pub3/full",
    date: "2022"
  },
  {
    id: "nice-hmb",
    title: "Heavy menstrual bleeding: assessment and management (NG88)",
    source: "National Institute for Health and Care Excellence (UK)",
    url: "https://www.nice.org.uk/guidance/ng88",
    date: "March 2018, Updated November 2021"
  },
  {
    id: "cdc-hygiene",
    title: "Menstrual Hygiene",
    source: "Centers for Disease Control and Prevention",
    url: "https://www.cdc.gov/healthywater/hygiene/menstrual/index.html",
    date: "August 2022"
  },
  {
    id: "rcog-pelvic-pain",
    title: "Chronic Pelvic Pain, Initial Management (Green-top Guideline No. 41)",
    source: "Royal College of Obstetricians & Gynaecologists",
    url: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/chronic-pelvic-pain-initial-management-green-top-guideline-no-41/",
    date: "May 2012, Updated 2022"
  },
  {
    id: "mayo-cramps",
    title: "Menstrual cramps",
    source: "Mayo Clinic",
    url: "https://www.mayoclinic.org/diseases-conditions/menstrual-cramps/symptoms-causes/syc-20374938",
    date: "March 2023"
  },
  {
    id: "nhs-period-pain",
    title: "Period pain",
    source: "National Health Service (UK)",
    url: "https://www.nhs.uk/conditions/period-pain/",
    date: "February 2022"
  },
  {
    id: "pcos-guidelines",
    title: "International evidence-based guideline for the assessment and management of polycystic ovary syndrome",
    source: "Endocrine Society (collaborator)",
    url: "https://www.endocrine.org/clinical-practice-guidelines/polycystic-ovary-syndrome",
    date: "2023"
  }
];

// Sample articles based on the guidelines provided
export const articles: Article[] = [
  {
    id: "menstrual-cycle-basics",
    title: "Understanding Your Menstrual Cycle Phases",
    category: ArticleCategory.BASICS,
    summary: "A comprehensive guide to the four phases of your menstrual cycle and what to expect during each one.",
    content: `
      <h2>The Four Phases of Your Menstrual Cycle</h2>
      <p>Your menstrual cycle is more than just your period. It's a complex process involving hormones, your ovaries, and your uterus, typically lasting between 21-35 days<sup><a href="${citations.find(c => c.id === "acog-menstruation")?.url}" target="_blank">[1]</a></sup>. Understanding these phases can help you recognize patterns in your body and identify potential health concerns.</p>
      
      <h3>Phase 1: Menstrual Phase (Days 1-5)</h3>
      <p>The first day of your period marks day 1 of your cycle. During this phase:</p>
      <ul>
        <li>The uterine lining sheds</li>
        <li>Bleeding typically lasts 3-7 days</li>
        <li>You may experience cramping due to uterine contractions</li>
      </ul>
      <p>The World Health Organization recognizes that menstruation is not just a biological process but a health and human rights issue that requires attention and resources<sup><a href="${citations.find(c => c.id === "who-statement")?.url}" target="_blank">[2]</a></sup>.</p>
      
      <h3>Phase 2: Follicular Phase (Days 1-13)</h3>
      <p>This phase overlaps with your period and continues until ovulation:</p>
      <ul>
        <li>Follicle-stimulating hormone (FSH) rises, stimulating follicle development in the ovaries</li>
        <li>Estrogen levels increase, causing the uterine lining to thicken</li>
        <li>One dominant follicle will eventually release an egg</li>
      </ul>
      
      <h3>Phase 3: Ovulation (Day 14, approximately)</h3>
      <p>Ovulation typically occurs mid-cycle, around day 14 of a 28-day cycle:</p>
      <ul>
        <li>A surge in luteinizing hormone (LH) triggers the release of an egg</li>
        <li>The egg travels down the fallopian tube toward the uterus</li>
        <li>This is your fertile window, lasting about 24-48 hours</li>
      </ul>
      
      <h3>Phase 4: Luteal Phase (Days 15-28)</h3>
      <p>After ovulation until your next period:</p>
      <ul>
        <li>The empty follicle forms the corpus luteum, producing progesterone</li>
        <li>Progesterone maintains the thickened uterine lining</li>
        <li>If no pregnancy occurs, progesterone and estrogen levels drop</li>
        <li>This drop triggers the next menstrual period</li>
      </ul>
      
      <h2>What's "Normal" for Your Cycle?</h2>
      <p>According to the American College of Obstetricians and Gynecologists<sup><a href="${citations.find(c => c.id === "acog-menstruation")?.url}" target="_blank">[1]</a></sup>, a normal cycle typically has these characteristics:</p>
      <ul>
        <li><strong>Cycle length:</strong> 21-35 days</li>
        <li><strong>Period length:</strong> 3-7 days</li>
        <li><strong>Blood loss:</strong> 30-80 mL (about 2-5 tablespoons)</li>
      </ul>
      
      <h2>When to Seek Help</h2>
      <p>Consider consulting a healthcare provider if you experience:</p>
      <ul>
        <li>Very heavy bleeding (changing pads/tampons every hour)</li>
        <li>Periods lasting longer than 7 days</li>
        <li>Severe pain that interferes with daily activities</li>
        <li>Irregular cycles (less than 21 or more than 35 days)</li>
        <li>Missed periods</li>
      </ul>
      <p>The UK's National Institute for Health and Care Excellence provides detailed guidelines on when to seek medical attention for heavy menstrual bleeding<sup><a href="${citations.find(c => c.id === "nice-hmb")?.url}" target="_blank">[5]</a></sup>.</p>
    `,
    lastUpdated: new Date('2025-04-01'),
    readTime: 5,
    vetted: true,
    author: "Dr. Sarah Johnson, OB-GYN",
    sources: ["acog-menstruation", "who-statement", "nice-hmb"]
  },
  {
    id: "diet-and-periods",
    title: "How Diet Affects Your Period",
    category: ArticleCategory.WELLNESS,
    summary: "Learn about the connection between nutrition and menstrual health, including foods that can help alleviate symptoms.",
    content: `
      <h2>The Diet-Menstruation Connection</h2>
      <p>What you eat can significantly impact your menstrual health. Research suggests that certain dietary patterns may help alleviate common period symptoms while others might exacerbate them.</p>
      
      <h3>Nutrients That Support Menstrual Health</h3>
      <ul>
        <li><strong>Iron:</strong> Helps replace what's lost during menstruation. Find it in lean meats, beans, and leafy greens.</li>
        <li><strong>Omega-3 fatty acids:</strong> May reduce inflammation and period pain. Sources include fatty fish, walnuts, and flaxseeds.</li>
        <li><strong>Magnesium:</strong> Can help reduce cramps and mood symptoms. Found in nuts, seeds, whole grains, and dark chocolate.</li>
        <li><strong>Calcium:</strong> May ease PMS symptoms. Sources include dairy products and fortified plant milks.</li>
        <li><strong>Vitamin D:</strong> Associated with reduced period pain. Sources include sunlight, fortified foods, and fatty fish.</li>
      </ul>
      
      <h3>Foods That May Worsen Period Symptoms</h3>
      <p>Some foods and ingredients have been associated with increased menstrual discomfort:</p>
      <ul>
        <li><strong>Salt:</strong> Can increase bloating and water retention</li>
        <li><strong>Sugar:</strong> May worsen mood swings and energy crashes</li>
        <li><strong>Alcohol:</strong> Can disrupt hormone balance and intensify mood symptoms</li>
        <li><strong>Caffeine:</strong> May increase breast tenderness and anxiety</li>
      </ul>
      
      <h3>Evidence-Based Dietary Approaches</h3>
      <p>Several dietary patterns have shown promise for managing menstrual symptoms in research studies:</p>
      
      <h4>Mediterranean Diet</h4>
      <p>Rich in fruits, vegetables, whole grains, olive oil, and fish, the Mediterranean diet offers anti-inflammatory benefits that may help reduce period pain and PMS symptoms.</p>
      
      <h4>Low-Inflammatory Foods</h4>
      <p>Research suggests that foods with anti-inflammatory properties may help with menstrual pain. These include:</p>
      <ul>
        <li>Colorful fruits and vegetables</li>
        <li>Fatty fish (salmon, sardines)</li>
        <li>Nuts and seeds</li>
        <li>Olive oil</li>
        <li>Herbs and spices (turmeric, ginger)</li>
      </ul>
      
      <p>The Mayo Clinic provides additional insights on managing menstrual cramps through lifestyle modifications and dietary changes<sup><a href="${citations.find(c => c.id === "mayo-cramps")?.url}" target="_blank">[8]</a></sup>.</p>
      
      <h3>Hydration and Menstrual Health</h3>
      <p>Staying well-hydrated is essential during your period. Proper hydration can:</p>
      <ul>
        <li>Reduce bloating</li>
        <li>Alleviate headaches</li>
        <li>Help prevent constipation (a common period complaint)</li>
      </ul>
      <p>The Centers for Disease Control and Prevention emphasizes the importance of proper hydration and hygiene practices during menstruation<sup><a href="${citations.find(c => c.id === "cdc-hygiene")?.url}" target="_blank">[6]</a></sup>.</p>
      
      <h2>When to Consider Nutritional Support</h2>
      <p>If you experience severe menstrual symptoms that impact your quality of life, consider:</p>
      <ul>
        <li>Consulting a registered dietitian who specializes in women's health</li>
        <li>Keeping a food and symptom diary to identify potential triggers</li>
        <li>Discussing with your healthcare provider if supplements might be beneficial</li>
      </ul>
      
      <p>Remember that while dietary changes may help manage symptoms, severe menstrual pain or abnormal bleeding should always be evaluated by a healthcare provider. The UK's National Health Service offers guidance on when to seek medical attention for period pain<sup><a href="${citations.find(c => c.id === "nhs-period-pain")?.url}" target="_blank">[9]</a></sup>.</p>
    `,
    lastUpdated: new Date('2025-03-15'),
    readTime: 7,
    vetted: true,
    author: "Dr. Maria Chen, MD, Nutritional Medicine",
    sources: ["mayo-cramps", "cdc-hygiene", "nhs-period-pain"]
  },
  {
    id: "managing-pms",
    title: "Managing PMS Symptoms Naturally",
    category: ArticleCategory.WELLNESS,
    summary: "Natural approaches to managing premenstrual syndrome symptoms without medication.",
    content: `
      <h2>Understanding PMS</h2>
      <p>Premenstrual syndrome (PMS) affects approximately 75% of menstruating women, with symptoms typically occurring 1-2 weeks before their period. While the exact cause remains unclear, hormonal fluctuations play a significant role.</p>
      
      <h3>Evidence-Based Natural Approaches</h3>
      
      <h4>1. Physical Activity</h4>
      <p>Regular exercise has been shown to reduce PMS symptoms through:</p>
      <ul>
        <li>Endorphin release, which improves mood</li>
        <li>Reduced inflammation</li>
        <li>Better sleep quality</li>
        <li>Decreased water retention</li>
      </ul>
      <p>Studies suggest that even moderate activity like walking for 30 minutes most days can make a difference.</p>
      
      <h4>2. Stress Management Techniques</h4>
      <p>Research indicates that stress can worsen PMS symptoms. Effective stress-reduction approaches include:</p>
      <ul>
        <li><strong>Mindfulness meditation:</strong> Has been shown to reduce PMS symptoms in several studies</li>
        <li><strong>Progressive muscle relaxation:</strong> Can reduce physical tension and cramps</li>
        <li><strong>Deep breathing exercises:</strong> Help activate the parasympathetic nervous system</li>
        <li><strong>Yoga:</strong> Combines physical activity with mindfulness for dual benefits</li>
      </ul>
      
      <h4>3. Sleep Optimization</h4>
      <p>Poor sleep can exacerbate PMS symptoms. Tips for better sleep during your premenstrual phase:</p>
      <ul>
        <li>Maintain a consistent sleep schedule</li>
        <li>Create a cool, dark sleeping environment</li>
        <li>Limit screen time before bed</li>
        <li>Avoid caffeine and alcohol, especially in the afternoon and evening</li>
      </ul>
      
      <h4>4. Heat Therapy</h4>
      <p>Applying heat to the lower abdomen has been shown to:</p>
      <ul>
        <li>Reduce muscle cramping</li>
        <li>Improve blood flow</li>
        <li>Provide pain relief comparable to some over-the-counter medications</li>
      </ul>
      <p>Methods include heating pads, warm baths, or adhesive heat patches.</p>
      
      <h4>5. Alternative Therapies</h4>
      <p>Some evidence supports the use of:</p>
      <ul>
        <li><strong>Acupuncture:</strong> Some studies show benefit for PMS symptoms</li>
        <li><strong>Transcutaneous electrical nerve stimulation (TENS):</strong> The Cochrane Library has reviewed evidence supporting TENS for menstrual pain<sup><a href="${citations.find(c => c.id === "cochrane-tens")?.url}" target="_blank">[4]</a></sup></li>
        <li><strong>Massage therapy:</strong> May help reduce pain and improve mood</li>
      </ul>
      
      <h3>When to Seek Medical Help</h3>
      <p>While natural approaches help many women, consider consulting a healthcare provider if:</p>
      <ul>
        <li>PMS symptoms significantly impact your daily life</li>
        <li>Natural approaches don't provide adequate relief</li>
        <li>You experience severe mood changes, including thoughts of harming yourself</li>
      </ul>
      <p>The Royal College of Obstetricians & Gynaecologists provides guidelines on when chronic pelvic pain requires medical evaluation<sup><a href="${citations.find(c => c.id === "rcog-pelvic-pain")?.url}" target="_blank">[7]</a></sup>.</p>
      
      <h3>A Holistic Approach</h3>
      <p>For best results, combine several natural approaches. Remember that what works varies between individuals, and finding your optimal combination may require some experimentation.</p>
    `,
    lastUpdated: new Date('2025-02-28'),
    readTime: 6,
    vetted: false,
    author: "Lisa Thompson, Women's Health Specialist",
    sources: ["cochrane-tens", "rcog-pelvic-pain"]
  },
  {
    id: "abnormal-bleeding",
    title: "Understanding Abnormal Uterine Bleeding",
    category: ArticleCategory.HEALTH,
    summary: "An evidence-based guide to identifying abnormal bleeding patterns and understanding treatment options.",
    content: `
      <h2>What is Abnormal Uterine Bleeding?</h2>
      <p>Abnormal uterine bleeding (AUB) describes menstrual bleeding of abnormal duration, volume, frequency, or regularity. According to the International Federation of Gynecology and Obstetrics (FIGO), AUB is classified using the PALM-COEIN system<sup><a href="${citations.find(c => c.id === "figo-aub")?.url}" target="_blank">[3]</a></sup>.</p>
      
      <h3>Signs of Abnormal Bleeding</h3>
      <p>According to evidence-based guidelines, abnormal bleeding may include:</p>
      <ul>
        <li>Bleeding between periods</li>
        <li>Periods lasting longer than 7 days</li>
        <li>Heavy bleeding (soaking through a pad/tampon every hour for several hours)</li>
        <li>Periods less than 21 days apart or more than 35 days apart</li>
        <li>Bleeding after menopause</li>
      </ul>
      
      <h3>The PALM-COEIN Classification System</h3>
      <p>FIGO's standardized system categorizes causes of AUB into:</p>
      
      <h4>Structural causes (PALM):</h4>
      <ul>
        <li><strong>P</strong>olyps</li>
        <li><strong>A</strong>denomyosis</li>
        <li><strong>L</strong>eiomyoma (fibroids)</li>
        <li><strong>M</strong>alignancy and hyperplasia</li>
      </ul>
      
      <h4>Non-structural causes (COEIN):</h4>
      <ul>
        <li><strong>C</strong>oagulopathy</li>
        <li><strong>O</strong>vulatory dysfunction</li>
        <li><strong>E</strong>ndometrial</li>
        <li><strong>I</strong>atrogenic</li>
        <li><strong>N</strong>ot otherwise classified</li>
      </ul>
      
      <h3>Diagnosis of Abnormal Bleeding</h3>
      <p>According to the National Institute for Health and Care Excellence (NICE) guidelines<sup><a href="${citations.find(c => c.id === "nice-hmb")?.url}" target="_blank">[5]</a></sup>, the diagnostic process may include:</p>
      <ul>
        <li>Detailed medical history</li>
        <li>Physical examination</li>
        <li>Blood tests (complete blood count, hormonal testing, coagulation studies)</li>
        <li>Pelvic ultrasound</li>
        <li>Endometrial biopsy (for women over 45 or with risk factors)</li>
        <li>Hysteroscopy (to visualize the uterine cavity)</li>
      </ul>
      
      <h3>Treatment Options</h3>
      <p>Treatment depends on the underlying cause, age, and desire for future fertility. Options may include:</p>
      
      <h4>Medical Treatments:</h4>
      <ul>
        <li>Hormonal methods (birth control pills, hormonal IUDs, etc.)</li>
        <li>Non-hormonal options (tranexamic acid, NSAIDs)</li>
        <li>Treatment of underlying conditions</li>
      </ul>
      
      <h4>Surgical Treatments:</h4>
      <ul>
        <li>Endometrial ablation (destroying the uterine lining)</li>
        <li>Myomectomy (removal of fibroids)</li>
        <li>Hysterectomy (removal of the uterus)</li>
        <li>Polypectomy (removal of polyps)</li>
      </ul>
      
      <h3>When to Seek Immediate Medical Attention</h3>
      <p>According to clinical guidelines, seek immediate care if you experience:</p>
      <ul>
        <li>Extremely heavy bleeding (soaking through pad/tampon every hour)</li>
        <li>Bleeding with dizziness or fainting</li>
        <li>Severe pain not relieved by over-the-counter medications</li>
        <li>Signs of infection (fever, unusual discharge, severe pain)</li>
      </ul>
      
      <h3>The Importance of Early Evaluation</h3>
      <p>Early evaluation of abnormal bleeding is important because:</p>
      <ul>
        <li>It can identify serious underlying conditions</li>
        <li>Treatment is often more effective when started early</li>
        <li>It can prevent complications like anemia</li>
        <li>It can improve quality of life</li>
      </ul>
      
      <p>Remember that abnormal bleeding is common, affecting up to 30% of women of reproductive age, and effective treatments are available.</p>
    `,
    lastUpdated: new Date('2025-03-10'),
    readTime: 8,
    vetted: true,
    author: "Dr. Rebecca Wong, Gynecologist",
    sources: ["figo-aub", "nice-hmb"]
  },
  {
    id: "pcos-overview",
    title: "Polycystic Ovary Syndrome: An Evidence-Based Overview",
    category: ArticleCategory.HEALTH,
    summary: "Understanding PCOS symptoms, diagnosis, and management strategies based on the latest clinical guidelines.",
    content: `
      <h2>What is Polycystic Ovary Syndrome (PCOS)?</h2>
      <p>Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder affecting approximately 8-13% of women of reproductive age. It's characterized by a combination of symptoms related to elevated androgens (male hormones) and ovarian dysfunction.</p>
      
      <h3>Diagnosis of PCOS</h3>
      <p>According to the international evidence-based guidelines<sup><a href="${citations.find(c => c.id === "pcos-guidelines")?.url}" target="_blank">[10]</a></sup>, diagnosis requires at least two of the following three criteria:</p>
      <ol>
        <li>Irregular or absent menstrual periods (oligo/anovulation)</li>
        <li>Clinical and/or biochemical signs of high androgens (hyperandrogenism)</li>
        <li>Polycystic ovaries on ultrasound</li>
      </ol>
      <p>Other conditions with similar symptoms must be ruled out before confirming a PCOS diagnosis.</p>
      
      <h3>Common Symptoms</h3>
      <p>PCOS symptoms vary widely between individuals but may include:</p>
      <ul>
        <li>Irregular or missed periods</li>
        <li>Heavy bleeding when periods occur</li>
        <li>Excess facial and body hair (hirsutism)</li>
        <li>Acne</li>
        <li>Hair thinning or male-pattern baldness</li>
        <li>Weight gain or difficulty losing weight</li>
        <li>Dark patches of skin (acanthosis nigricans)</li>
        <li>Multiple small cysts on the ovaries</li>
      </ul>
      
      <h3>Health Implications</h3>
      <p>PCOS is associated with increased risk of:</p>
      <ul>
        <li>Infertility</li>
        <li>Type 2 diabetes</li>
        <li>Cardiovascular disease</li>
        <li>Endometrial cancer</li>
        <li>Sleep apnea</li>
        <li>Depression and anxiety</li>
        <li>Nonalcoholic fatty liver disease</li>
      </ul>
      
      <h3>Evidence-Based Management Strategies</h3>
      <p>According to the latest international guidelines<sup><a href="${citations.find(c => c.id === "pcos-guidelines")?.url}" target="_blank">[10]</a></sup>, management should be tailored to individual symptoms and goals:</p>
      
      <h4>Lifestyle Modifications</h4>
      <p>First-line treatment includes:</p>
      <ul>
        <li>Regular physical activity (at least 150 minutes per week)</li>
        <li>Balanced diet focused on whole foods</li>
        <li>Achieving and maintaining a healthy weight (even 5-10% weight loss can significantly improve symptoms)</li>
        <li>Smoking cessation</li>
      </ul>
      
      <h4>Menstrual Irregularity and Ovulation</h4>
      <ul>
        <li>Hormonal contraceptives (pills, patches, rings) to regulate periods</li>
        <li>Cyclic progestins</li>
        <li>For those seeking pregnancy: ovulation induction medications</li>
      </ul>
      
      <h4>Hirsutism and Acne</h4>
      <ul>
        <li>Hormonal contraceptives</li>
        <li>Anti-androgen medications (with appropriate contraception)</li>
        <li>Topical treatments for mild symptoms</li>
        <li>Hair removal methods</li>
      </ul>
      
      <h4>Metabolic Features</h4>
      <ul>
        <li>Metformin for those with diabetes risk factors</li>
        <li>Regular screening for diabetes and cardiovascular risk factors</li>
        <li>Management of individual risk factors (cholesterol, blood pressure)</li>
      </ul>
      
      <h4>Psychological Health</h4>
      <ul>
        <li>Screening for anxiety and depression</li>
        <li>Referral to mental health specialists when needed</li>
        <li>Support groups and counseling</li>
      </ul>
      
      <h3>Living Well with PCOS</h3>
      <p>PCOS is a lifelong condition, but with proper management, most women can effectively control their symptoms and reduce long-term health risks. Key points to remember:</p>
      <ul>
        <li>Regular follow-up with healthcare providers is essential</li>
        <li>Management strategies may need adjustment over time</li>
        <li>A multidisciplinary approach (gynecologist, endocrinologist, dietitian, etc.) often works best</li>
        <li>Self-advocacy and education are important aspects of care</li>
      </ul>
      
      <p>For specific treatment recommendations, always consult with healthcare providers who can tailor advice to your individual situation.</p>
    `,
    lastUpdated: new Date('2025-03-28'),
    readTime: 9,
    vetted: true,
    author: "Dr. James Rodriguez, Endocrinologist",
    sources: ["pcos-guidelines"]
  },
  {
    id: "period-myths",
    title: "Menstrual Myths vs. Facts: What Science Actually Says",
    category: ArticleCategory.MYTHS,
    summary: "Debunking common misconceptions about periods with evidence-based information.",
    content: `
      <h2>Separating Menstrual Myths from Facts</h2>
      <p>Menstruation has been surrounded by myths and taboos across cultures and throughout history. Let's examine some common misconceptions and what the scientific evidence actually tells us.</p>
      
      <h3>Myth: You Can't Get Pregnant During Your Period</h3>
      <p><strong>Fact:</strong> While the chance is lower, pregnancy can occur if you have sex during your period, especially in women with shorter cycles or longer periods. Sperm can survive in the female reproductive tract for up to 5 days, and ovulation can happen soon after a period ends in short cycles.</p>
      
      <h3>Myth: Exercise Makes Period Pain Worse</h3>
      <p><strong>Fact:</strong> According to the Mayo Clinic<sup><a href="${citations.find(c => c.id === "mayo-cramps")?.url}" target="_blank">[8]</a></sup>, regular physical activity can actually help reduce menstrual pain by releasing endorphins (natural pain relievers) and improving blood circulation to the uterus. Light to moderate exercise is generally beneficial during your period.</p>
      
      <h3>Myth: Severe Pain During Periods is Normal</h3>
      <p><strong>Fact:</strong> While mild to moderate discomfort is common, severe pain that interferes with daily activities is not normal and may indicate underlying conditions like endometriosis or adenomyosis. The Royal College of Obstetricians & Gynaecologists provides guidelines on when to seek medical help for chronic pelvic pain<sup><a href="${citations.find(c => c.id === "rcog-pelvic-pain")?.url}" target="_blank">[7]</a></sup>.</p>
      
      <h3>Myth: Having Your Period Means You're Losing Too Much Blood</h3>
      <p><strong>Fact:</strong> The average blood loss during a period is only about 30-80 milliliters (2-5 tablespoons) across the entire cycle. However, if you're soaking through a pad or tampon every hour for several consecutive hours, this could indicate heavy menstrual bleeding (menorrhagia) and should be evaluated by a healthcare provider, according to NICE guidelines<sup><a href="${citations.find(c => c.id === "nice-hmb")?.url}" target="_blank">[5]</a></sup>.</p>
      
      <h3>Myth: Irregularity in Cycles Is Always a Problem</h3>
      <p><strong>Fact:</strong> Cycle length varies between individuals and can be affected by stress, weight changes, exercise, and other factors. According to the American College of Obstetricians and Gynecologists<sup><a href="${citations.find(c => c.id === "acog-menstruation")?.url}" target="_blank">[1]</a></sup>, normal cycles can range from 21-35 days. However, consistently irregular periods should be evaluated, especially if they're new or changing.</p>
      
      <h3>Myth: Your Cycle Syncs with Friends or Roommates</h3>
      <p><strong>Fact:</strong> Despite popular belief, research doesn't strongly support menstrual synchrony. The original studies suggesting this phenomenon have methodological flaws, and more rigorous research has failed to confirm that people who live together develop synchronized cycles.</p>
      
      <h3>Myth: You Shouldn't Bathe or Wash Your Hair During Your Period</h3>
      <p><strong>Fact:</strong> There is no medical reason to avoid bathing or washing hair during menstruation. In fact, the CDC emphasizes the importance of maintaining good hygiene during menstruation<sup><a href="${citations.find(c => c.id === "cdc-hygiene")?.url}" target="_blank">[6]</a></sup>.</p>
      
      <h3>Myth: PMS Is Just in Your Head</h3>
      <p><strong>Fact:</strong> Premenstrual syndrome (PMS) is a real medical condition caused by hormonal changes. It can cause physical symptoms (bloating, breast tenderness, headaches) and mood changes (irritability, anxiety, depression). For some, these symptoms are severe enough to interfere with daily life.</p>
      
      <h3>Myth: Using Tampons or Menstrual Cups Means You're No Longer a Virgin</h3>
      <p><strong>Fact:</strong> Virginity is not determined by whether a hymen is intact. The hymen is a thin, flexible membrane that can stretch without breaking, and its appearance varies widely between individuals. Using tampons or menstrual cups does not change one's virginity status, which is a social concept, not a medical one.</p>
      
      <h3>Myth: Hormonal Birth Control Is Harmful to Your Body</h3>
      <p><strong>Fact:</strong> While all medications have potential side effects, hormonal contraceptives are generally safe for most people and can offer benefits beyond contraception, including reduced menstrual pain, lighter bleeding, and improved acne. Some can even reduce the risk of certain cancers. Individual risks should be discussed with a healthcare provider.</p>
      
      <h3>The Importance of Evidence-Based Information</h3>
      <p>Misconceptions about menstruation can lead to unnecessary worry or prevent people from seeking help for genuine medical concerns. The World Health Organization emphasizes that accurate information about menstruation is a fundamental right<sup><a href="${citations.find(c => c.id === "who-statement")?.url}" target="_blank">[2]</a></sup>. When in doubt, consult reliable health resources or speak with a healthcare provider.</p>
    `,
    lastUpdated: new Date('2025-04-05'),
    readTime: 6,
    vetted: true,
    author: "Dr. Emily Brooks, Public Health Specialist",
    sources: ["acog-menstruation", "who-statement", "mayo-cramps", "rcog-pelvic-pain", "nice-hmb", "cdc-hygiene"]
  }
];

// Map articles to categories for easier filtering
export const articlesByCategory = Object.values(ArticleCategory).reduce((acc, category) => {
  acc[category] = articles.filter(article => article.category === category);
  return acc;
}, {} as Record<ArticleCategory, Article[]>);

// Featured articles (could be based on various criteria)
export const featuredArticles = articles.filter(article => article.vetted).slice(0, 3);
