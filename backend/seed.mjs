import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);

const courses = [
  {
    title: "IoT and C Programming",
    subject: "Computer Science",
    description: "A comprehensive course covering Internet of Things fundamentals, IoT protocols, enabled technologies, domain-specific IoT applications, and C programming from basics to advanced concepts.",
    is_published: true,
    modules: [
      {
        title: "Introduction to IoT – Sensors, Actuators & Physical Design",
        order_index: 0,
        is_locked: false,
        lessons: [
          {
            title: "Definition, Characteristics & Physical Design of IoT",
            type: "doc",
            order_index: 0,
            content_url: "iot_intro_sensors_actuators.txt"
          },
          {
            title: "Sensors and Actuators in IoT",
            type: "doc",
            order_index: 1,
            content_url: "iot_intro_sensors_actuators.txt"
          }
        ]
      },
      {
        title: "IoT Protocols, Communication Models & APIs",
        order_index: 1,
        is_locked: true,
        lessons: [
          {
            title: "IoT Protocols – MQTT, CoAP, Zigbee, BLE",
            type: "doc",
            order_index: 0,
            content_url: "iot_protocols_communication.txt"
          },
          {
            title: "IoT Communication Models and APIs",
            type: "doc",
            order_index: 1,
            content_url: "iot_protocols_communication.txt"
          }
        ]
      },
      {
        title: "IoT Enabled Technologies & Domain-Specific IoT",
        order_index: 2,
        is_locked: true,
        lessons: [
          {
            title: "WSN, Cloud Computing & Embedded Systems in IoT",
            type: "doc",
            order_index: 0,
            content_url: "iot_enabled_technologies_domains.txt"
          },
          {
            title: "IoT Levels, Templates & Domain Applications",
            type: "doc",
            order_index: 1,
            content_url: "iot_enabled_technologies_domains.txt"
          }
        ]
      },
      {
        title: "C Programming – Basics, Data Types & Operators",
        order_index: 3,
        is_locked: true,
        lessons: [
          {
            title: "Introduction to C: Variables, Data Types & Format Specifiers",
            type: "doc",
            order_index: 0,
            content_url: "c_programming_basics.txt"
          },
          {
            title: "Operators, Input/Output & Constants in C",
            type: "doc",
            order_index: 1,
            content_url: "c_programming_basics.txt"
          }
        ]
      },
      {
        title: "C Programming – Control Structures, Functions & Pointers",
        order_index: 4,
        is_locked: true,
        lessons: [
          {
            title: "Conditional Statements, Loops & Control Flow in C",
            type: "doc",
            order_index: 0,
            content_url: "c_control_functions_pointers.txt"
          },
          {
            title: "Functions, Recursion, Pointers, Arrays & Strings",
            type: "doc",
            order_index: 1,
            content_url: "c_control_functions_pointers.txt"
          }
        ]
      }
    ]
  },
  {
    title: "Computer Networking",
    subject: "Computer Science",
    description: "A complete course on computer networking covering OSI/TCP-IP models, network protocols, devices, security mechanisms, routing, and switching concepts.",
    is_published: true,
    modules: [
      {
        title: "Network Fundamentals – OSI Model, TCP/IP & IP Addressing",
        order_index: 0,
        is_locked: false,
        lessons: [
          {
            title: "Introduction to Networking, OSI Model & TCP/IP Stack",
            type: "doc",
            order_index: 0,
            content_url: "networking_fundamentals.txt"
          },
          {
            title: "IP Addressing, Subnetting & Network Types",
            type: "doc",
            order_index: 1,
            content_url: "networking_fundamentals.txt"
          }
        ]
      },
      {
        title: "Network Protocols & Devices",
        order_index: 1,
        is_locked: true,
        lessons: [
          {
            title: "Application & Transport Layer Protocols – HTTP, DNS, TCP, UDP",
            type: "doc",
            order_index: 0,
            content_url: "networking_protocols_devices.txt"
          },
          {
            title: "Network Devices – Hubs, Switches, Routers, Firewalls & VLANs",
            type: "doc",
            order_index: 1,
            content_url: "networking_protocols_devices.txt"
          }
        ]
      },
      {
        title: "Network Security & Routing",
        order_index: 2,
        is_locked: true,
        lessons: [
          {
            title: "Network Security – Firewalls, Encryption, VPN & IDS/IPS",
            type: "doc",
            order_index: 0,
            content_url: "networking_security_routing.txt"
          },
          {
            title: "Routing Protocols – RIP, OSPF, BGP & Switching/STP",
            type: "doc",
            order_index: 1,
            content_url: "networking_security_routing.txt"
          }
        ]
      }
    ]
  }
];

async function seed() {
  console.log("🌱 Starting seed...\n");

  for (const courseData of courses) {
    const { modules, ...courseFields } = courseData;

    // Check if course already exists
    const { data: existing } = await supabase
      .from('courses')
      .select('id')
      .eq('title', courseFields.title)
      .single();

    if (existing) {
      console.log(`⚠️  Course "${courseFields.title}" already exists. Skipping...`);
      continue;
    }

    // Insert course
    const { data: course, error: courseErr } = await supabase
      .from('courses')
      .insert([courseFields])
      .select()
      .single();

    if (courseErr) {
      console.error(`❌ Failed to insert course "${courseFields.title}":`, courseErr.message);
      continue;
    }

    console.log(`✅ Created course: "${course.title}" (${course.id})`);

    for (const moduleData of modules) {
      const { lessons, ...moduleFields } = moduleData;

      const { data: mod, error: modErr } = await supabase
        .from('modules')
        .insert([{ ...moduleFields, course_id: course.id }])
        .select()
        .single();

      if (modErr) {
        console.error(`  ❌ Failed to insert module "${moduleFields.title}":`, modErr.message);
        continue;
      }

      console.log(`  📦 Module: "${mod.title}"`);

      const lessonsToInsert = lessons.map(l => ({ ...l, module_id: mod.id }));
      const { error: lessonErr } = await supabase.from('lessons').insert(lessonsToInsert);

      if (lessonErr) {
        console.error(`    ❌ Failed to insert lessons:`, lessonErr.message);
      } else {
        lessons.forEach(l => console.log(`    📄 Lesson: "${l.title}"`));
      }
    }

    console.log('');
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
