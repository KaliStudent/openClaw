# Agent Configuration Schema

## agent_config.json

```json
{
  "agent_id": "uuid",
  "customer_id": "uuid",
  "name": "Business Assistant Name",
  "version": "1.0.0",
  
  "business_profile": {
    "name": "Acme Auto Repair",
    "type": "auto_repair",
    "industry": "automotive",
    "description": "Full-service auto repair shop specializing in domestic and import vehicles",
    "hours": {
      "monday": "8:00-18:00",
      "tuesday": "8:00-18:00",
      "wednesday": "8:00-18:00",
      "thursday": "8:00-18:00",
      "friday": "8:00-17:00",
      "saturday": "9:00-14:00",
      "sunday": "closed"
    },
    "timezone": "America/Chicago",
    "location": {
      "address": "123 Main St",
      "city": "Austin",
      "state": "TX",
      "zip": "78701",
      "phone": "+15125551234"
    },
    "services": [
      {"name": "Oil Change", "price_range": "$39-$79", "duration_min": 30},
      {"name": "Brake Service", "price_range": "$150-$400", "duration_min": 60},
      {"name": "Diagnostics", "price_range": "$89", "duration_min": 45}
    ],
    "staff": [
      {"name": "Mike", "role": "owner", "contact": "mike@acmeauto.com"},
      {"name": "Sarah", "role": "service_advisor", "extension": "102"}
    ]
  },

  "agent_config": {
    "model": "cost-effective-default",
    "temperature": 0.7,
    "max_tokens": 1024,
    "languages": ["en", "es"],
    "primary_language": "en",
    "personality": "friendly",
    "formality": "casual-professional",
    "voice": {
      "enabled": true,
      "voice_id": "professional-male-en",
      "speed": 1.0
    }
  },

  "skills": {
    "enabled": [
      "core_conversation",
      "business_info",
      "language",
      "escalation",
      "appointment_scheduling",
      "receptionist_phone",
      "faq_management"
    ],
    "disabled": [
      "basic_coding",
      "landing_page_builder",
      "fullstack_dev"
    ],
    "addons": []
  },

  "channels": {
    "web_chat": {
      "enabled": true,
      "widget_config": {
        "position": "bottom-right",
        "color": "#2563eb",
        "greeting": "Hi! How can I help you today?",
        "greeting_es": "¡Hola! ¿En qué puedo ayudarle?"
      }
    },
    "phone": {
      "enabled": true,
      "number": "+15125559876",
      "greeting": "Thank you for calling Acme Auto Repair, this is your virtual assistant. How can I help you?",
      "hold_music": "default",
      "voicemail_after_seconds": 30,
      "transfer_to": "+15125551234"
    },
    "voice_chat": {
      "enabled": true
    }
  },

  "escalation": {
    "triggers": [
      "customer_angry",
      "legal_question",
      "pricing_negotiation",
      "emergency",
      "unknown_topic_3_attempts"
    ],
    "method": "transfer_call",
    "fallback": "take_message",
    "notify": ["mike@acmeauto.com"]
  },

  "integrations": {
    "calendar": null,
    "crm": null,
    "pos": null,
    "custom_webhooks": []
  }
}
```

## Skill Module Definition

Each skill module follows this structure:

```json
{
  "skill_id": "appointment_scheduling",
  "name": "Appointment Scheduling",
  "version": "1.0.0",
  "description": "Handle appointment booking, rescheduling, and cancellation",
  "category": "operations",
  
  "capabilities": [
    "book_appointment",
    "reschedule_appointment",
    "cancel_appointment",
    "check_availability",
    "send_confirmation"
  ],
  
  "required_config": [
    "business_hours",
    "services_with_duration",
    "calendar_integration_or_manual"
  ],
  
  "prompt_injection": "You can schedule appointments for customers. Available services: {services}. Business hours: {hours}. Always confirm: date, time, service, customer name, and phone number before booking.",
  
  "tools": [
    {
      "name": "check_availability",
      "description": "Check available time slots for a given date and service",
      "parameters": {
        "date": "ISO date",
        "service": "service name",
        "duration_min": "integer"
      }
    },
    {
      "name": "book_slot",
      "description": "Book a confirmed appointment",
      "parameters": {
        "date": "ISO date",
        "time": "HH:MM",
        "service": "service name",
        "customer_name": "string",
        "customer_phone": "string",
        "notes": "string (optional)"
      }
    }
  ]
}
```

## Deployment Modes

| Mode | Use Case | Skills Loaded |
|------|----------|---------------|
| `full` | Master agent, all capabilities | ALL |
| `configured` | Customer deployment | Per agent_config.skills.enabled |
| `specialist` | Single-purpose deployment | ONE skill + core |
| `minimal` | Cost-optimized chatbot | core_conversation + business_info |

## Multi-tenancy

- Each customer gets isolated agent config
- Shared model infrastructure
- Per-customer conversation history
- Rate limiting per customer tier
- Skill modules are shared code, customer data is isolated
