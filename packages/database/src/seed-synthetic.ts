import { Pool, type PoolClient } from 'pg';
import { createHash } from 'node:crypto';

const TARGET = 'start_force_synthetic_test';
const urlText = process.env.DATABASE_URL;
if (!urlText) throw new Error('DATABASE_URL is missing. Set it in this PowerShell session first.');
const url = new URL(urlText);
if (decodeURIComponent(url.pathname.slice(1)) !== TARGET) {
  throw new Error(`Refusing to seed database other than ${TARGET}`);
}

const pool = new Pool({ connectionString: urlText });
const marker = 'synthetic.startforce.test';
const topics = [
  ['AI', 'Explainable AI assistant for small businesses'],
  ['Healthcare', 'Remote wellness follow-up platform'],
  ['Agriculture', 'Smart irrigation advisory service'],
  ['Education', 'Adaptive peer learning platform'],
  ['Fintech', 'Personal budgeting insights tool'],
  ['Sustainability', 'Community waste reduction network'],
  ['Cybersecurity', 'Phishing awareness training portal'],
  ['Transportation', 'Shared commute coordination service'],
  ['Energy', 'Household energy monitoring dashboard'],
  ['Accessibility', 'Accessible campus navigation assistant'],
] as const;
const stages = ['Research', 'Prototype', 'MVP', 'Startup'] as const;
const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
const visibility = ['Public', 'Limited', 'Private'] as const;
const accessStatuses = ['PENDING', 'APPROVED', 'REJECTED'] as const;

function stableUUID(kind: string, n: number): string {
  const h = createHash('sha256').update(`start-force-synthetic-v1:${kind}:${n}`).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

async function count(client: PoolClient, table: string): Promise<number> {
  const allowed = new Set(['users', 'ideas', 'research_items', 'idea_access']);
  if (!allowed.has(table)) throw new Error('Invalid table name');
  const result = await client.query(`SELECT count(*)::int AS n FROM ${table}`);
  return result.rows[0].n;
}

async function main() {
  const client = await pool.connect();
  try {
    const db = await client.query('SELECT current_database() AS name');
    if (db.rows[0].name !== TARGET) throw new Error('Database identity mismatch');
    await client.query('BEGIN');
    const current = await Promise.all(['users', 'ideas', 'research_items', 'idea_access'].map(t => count(client, t)));
    if (current.some(n => n !== 0)) {
      throw new Error(`Seed requires an empty synthetic database. Current counts: ${current.join(', ')}. No changes made.`);
    }
    const required: Record<string, string[]> = {
      users: ['id','name','email','password_hash','created_at','updated_at'],
      ideas: ['id','owner_id','status','visibility','current_step','title','description','category','stage','problem_statement','target_users','current_solution','problem_evidence','solution_description','how_it_works','unique_value','technology_approach','technology_domain','technology_readiness','required_technology','existing_implementation','validation_method','validation_audience','validation_sample_size','validation_findings','validation_evidence','collaboration_needs','funding','created_at','updated_at'],
      research_items: ['id','idea_id','type','title','url','source','year','relevance','created_at'],
      idea_access: ['id','idea_id','user_id','status','created_at','updated_at'],
    };
    for (const [table, cols] of Object.entries(required)) {
      const res = await client.query('SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2', ['public', table]);
      const actual = new Set(res.rows.map(r => r.column_name));
      const missing = cols.filter(c => !actual.has(c));
      if (missing.length) throw new Error(`Schema mismatch for ${table}: missing ${missing.join(', ')}`);
    }

    const userIds: string[] = [];
    for (let i = 0; i < 50; i++) {
      const id = stableUUID('user', i); userIds.push(id);
      await client.query('INSERT INTO users (id,name,email,password_hash) VALUES ($1,$2,$3,$4)', [
        id, `Synthetic Tester ${String(i + 1).padStart(2, '0')}`,
        `tester${String(i + 1).padStart(2, '0')}@${marker}`,
        '!DISABLED_SYNTHETIC_ACCOUNT_NO_LOGIN!',
      ]);
    }

    const ideaIds: string[] = [];
    for (let i = 0; i < 200; i++) {
      const id = stableUUID('idea', i); ideaIds.push(id);
      const [category, concept] = topics[i % topics.length];
      const title = `${concept} Ã¢â‚¬â€ Test Concept ${String(i + 1).padStart(3, '0')}`;
      const status = statuses[i % statuses.length];
      const vis = status === 'PUBLISHED' ? visibility[i % visibility.length] : 'Private';
      const funding = { needsFunding: i % 3 === 0 ? 'Yes' : 'No', amount: i % 3 === 0 ? '250000' : '', type: 'Grant', purpose: 'Prototype validation', resources: [] };
      await client.query(`INSERT INTO ideas (
        id,owner_id,status,visibility,current_step,title,description,category,stage,
        problem_statement,target_users,current_solution,problem_evidence,
        solution_description,how_it_works,unique_value,
        technology_approach,technology_domain,technology_readiness,required_technology,existing_implementation,
        validation_method,validation_audience,validation_sample_size,validation_findings,validation_evidence,
        collaboration_needs,funding
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28
      )`, [
        id,
        userIds[i % 50],
        status,
        vis,
        i % 5 + 1,
        title,
        `A synthetic ${concept.toLowerCase()} concept built to validate a clear user problem and a practical, testable solution.`,
        category,
        stages[i % stages.length],
        `The core problem is fragmented execution and limited visibility for teams working in ${category.toLowerCase()} contexts.`,
        `Small business operators, practitioners, and early adopters in ${category.toLowerCase()} workflows.`,
        `A lightweight digital workflow that helps users prioritize actions, track outcomes, and reduce coordination friction.`,
        `Evidence is based on process mapping, user interviews, and prototype feedback from early participants.`,
        `The solution combines guided onboarding, contextual recommendations, and a simple shared dashboard for iteration.`,
        JSON.stringify([
  {
    id: `synthetic-role-${i + 1}`,
    role: 'Product Designer',
    responsibilities: 'Design user interfaces and improve product usability',
    skills: 'Figma, UX Research',
    openings: '1',
    collaborationType: 'Remote',
  },
]),
        `The concept stands out through fast value delivery, pragmatic onboarding, and measurable operational impact.`,
        `Use a lightweight web application with dashboards, automation, and simple reporting flows.`,
        category,
        `TR-${String((i % 5) + 2)}`,
        'No specialized hardware required beyond a modern browser and cloud hosting.',
        'Prototype exists and is being validated with a small pilot cohort.',
        'Customer interviews and pilot usability testing',
        `Early adopters in ${category.toLowerCase()} operations`,
        String((i % 10) + 8),
        `Early validation showed strong demand for clearer workflows and faster decision support.`,
        `Interview notes, prototype walkthroughs, and pilot feedback summaries.`,
        JSON.stringify([]),
        JSON.stringify({
          needsFunding: i % 3 === 0 ? 'Yes' : 'No',
          amount: i % 3 === 0 ? '250000' : '',
          type: 'Grant',
          purpose: 'Prototype validation',
          resources: [],
        }),
      ]);
    }

    for (let i = 0; i < 200; i++) {
      const id = stableUUID('research', i);
      const ideaId = ideaIds[i % ideaIds.length];
      const itemType = i % 2 === 0 ? 'article' : 'report';
      await client.query(
        'INSERT INTO research_items (id, idea_id, type, title, url, source, year, relevance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          id,
          ideaId,
          itemType,
          `Synthetic research item ${String(i + 1).padStart(3, '0')}`,
          `https://example.com/research/${i + 1}`,
          'Synthetic study',
          2024,
          (i % 5) + 1,
        ],
      );
    }

    for (let i = 0; i < 200; i++) {
      const ideaId = ideaIds[i % ideaIds.length];
      const targetUser = userIds[(i * 7) % userIds.length];
      const status = accessStatuses[i % accessStatuses.length];
      await client.query(
        'INSERT INTO idea_access (id, idea_id, user_id, status) VALUES ($1, $2, $3, $4)',
        [
          stableUUID(`access-${i}`, i),
          ideaId,
          targetUser,
          status,
        ],
      );
    }

    await client.query('COMMIT');
    console.log('Synthetic seed complete.', { users: userIds.length, ideas: ideaIds.length, researchItems: 200, accessRecords: 200 });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

main().catch((error) => {
  console.error('Synthetic seed failed:', error);
  process.exit(1);
});