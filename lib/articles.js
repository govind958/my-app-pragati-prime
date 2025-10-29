// Article management utilities
export const getArticles = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('articles');
  if (!stored) {
    // Initialize with default articles
    const defaultArticles = [
      {
        id: '1',
        title: "Expanding Access to Education",
        slug: "education-access",
        description: "Discover how our community-led education programs are transforming lives across rural areas. From scholarship initiatives to teacher training workshops, we're building sustainable educational ecosystems that empower children and families for generations to come.",
        content: `# Expanding Access to Education

Education is the cornerstone of empowerment, and at Pragati Prime, we believe that every child deserves access to quality education regardless of their socioeconomic background.

## Our Approach

Our community-led education programs are transforming lives across rural areas through:

- **Scholarship Programs**: Providing financial support to underprivileged students
- **Teacher Training**: Building capacity among educators in underserved communities
- **Learning Resources**: Supplying books, digital tools, and educational materials
- **Community Engagement**: Working with parents and local leaders to promote education

## Impact

Over the past year, we've supported over 500 students through scholarships and provided training to 120 teachers across 15 communities. The results speak for themselves - with a 95% retention rate and improved academic performance.

## Looking Ahead

We're committed to expanding our reach and building sustainable educational ecosystems that will empower children and families for generations to come.`,
        author: "Pragati Prime Team",
        date: "2024-12-15",
        image: "/new-1.png",
        category: "Education",
      },
      {
        id: '2',
        title: "Health Camps Impact Report",
        slug: "health-impact",
        description: "An in-depth analysis of our quarterly health camp initiatives. Learn about the thousands of lives touched through free medical checkups, vaccination drives, and health awareness programs that are making healthcare accessible to underserved communities.",
        content: `# Health Camps Impact Report

Access to healthcare is a fundamental right, yet many communities lack the resources and infrastructure to receive basic medical care. Our quarterly health camp initiatives are bridging this gap.

## Program Highlights

### Q4 2024 Achievements

- **Free Health Camps**: 12 camps organized across 8 districts
- **Patients Served**: Over 3,000 individuals received medical checkups
- **Vaccination Drives**: 1,500+ children and adults vaccinated
- **Health Awareness Sessions**: 25 workshops on preventive care and hygiene

## Key Initiatives

1. **Medical Checkups**: Comprehensive health screenings including blood pressure, blood sugar, and general consultations
2. **Vaccination Programs**: Immunization drives for children and adults
3. **Health Education**: Workshops on nutrition, hygiene, and preventive care
4. **Mental Health Support**: Counseling services for those in need

## Community Feedback

The health camps have been met with overwhelming positivity. Many community members have expressed gratitude for bringing healthcare directly to their doorsteps.

## Future Goals

We aim to expand our health camp coverage to reach an additional 5,000 individuals in the next quarter.`,
        author: "Pragati Prime Team",
        date: "2024-12-10",
        image: "/new-2.png",
        category: "Healthcare",
      },
      {
        id: '3',
        title: "Women in Leadership",
        slug: "women-leadership",
        description: "Celebrating the remarkable journeys of women entrepreneurs who've built successful businesses through our mentorship programs. These inspiring stories showcase how economic empowerment creates ripple effects throughout entire communities.",
        content: `# Women in Leadership

Empowering women to become leaders in their communities and businesses is central to our mission at Pragati Prime.

## Success Stories

### Priya's Journey

Starting with just a small loan of ₹20,000, Priya has built a thriving tailoring business that now employs 5 other women. Through our entrepreneurship training and mentorship program, she learned essential business skills and gained the confidence to scale her operations.

### Rekha's Impact

Rekha's organic farming initiative has not only provided her family with sustainable income but has inspired 15 other women in her village to start similar ventures. Her leadership has transformed the agricultural landscape of her community.

## Our Programs

- **Entrepreneurship Training**: Comprehensive business development workshops
- **Micro-loan Programs**: Access to capital for starting small businesses
- **Mentorship**: One-on-one guidance from successful entrepreneurs
- **Financial Literacy**: Understanding markets, pricing, and financial management

## The Ripple Effect

When one woman succeeds, the impact extends far beyond her immediate circle. These entrepreneurs:

- Create employment opportunities for others
- Inspire other women to pursue their dreams
- Contribute to household incomes and education
- Strengthen the economic foundation of their communities

## Join Us

We're always looking to expand our network of mentors and supporters. If you're interested in empowering women entrepreneurs, reach out to learn more about our programs.`,
        author: "Pragati Prime Team",
        date: "2024-12-05",
        image: "/new-3.png",
        category: "Women Empowerment",
      },
    ];
    localStorage.setItem('articles', JSON.stringify(defaultArticles));
    return defaultArticles;
  }
  return JSON.parse(stored);
};

export const getArticleBySlug = (slug) => {
  const articles = getArticles();
  return articles.find(article => article.slug === slug);
};

export const saveArticle = (article) => {
  const articles = getArticles();
  if (article.id) {
    // Update existing article
    const index = articles.findIndex(a => a.id === article.id);
    if (index !== -1) {
      articles[index] = article;
    }
  } else {
    // Create new article
    article.id = Date.now().toString();
    article.slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    article.date = new Date().toISOString().split('T')[0];
    articles.unshift(article);
  }
  localStorage.setItem('articles', JSON.stringify(articles));
  return article;
};

export const deleteArticle = (id) => {
  const articles = getArticles();
  const filtered = articles.filter(a => a.id !== id);
  localStorage.setItem('articles', JSON.stringify(filtered));
  return filtered;
};

