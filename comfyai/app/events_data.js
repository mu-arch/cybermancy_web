const events_selection = {
    type: "event",
    title: '1. Event Selection',
    desc: 'Choose the event below that you want to watch for. You can fine-tune exact properties on the next screen.',
    sidebar_header: "Event example",
    sidebar_text: "In case you're struggling with the concepts of events (that's okay, you'll get it!) let's go over an example:\nImagine you are opening your fridge. When the door opens the light comes on. Cause and effect. The cause (event) is the door opening and the effect is the light coming on. Now imagine you could bind any effect you wanted to your fridge's door opening, like playing a sound effect, or showing a notification on your phone.\nLet's think about this in terms of Discord now. Instead of just the fridge's door opening we have a number of different possible events. When a message is sent in your server that is an event. Emoji reactions, people joining and leaving your server, etc, are all events.",
    types: [
        {
            name: 'reaction',
            desc: 'Triggers when a message is reacted or un-reacted to in your server.'
        },


        {
            name: 'message',
            desc: 'Triggers when a message is sent, edited, deleted in your server.',
            full_desc: "",
            struct: [
                {
                    name: "equals",
                    type: "text",
                    desc: ""
                },
                {
                    name: "contains",
                    type: "array(text_value_struct)",
                    desc: ""
                },
                {
                    name: "author",
                    type: "array(u64)",
                    desc: ""
                },
                {
                    name: "length",
                    type: "u16",
                    desc: ""
                },
                {
                    name: "channels",
                    type: "array(u64)",
                    desc: ""
                },
                {
                    name: "has_data_attachment",
                    type: "bool",
                    desc: ""
                },
                {
                    name: "has_image",
                    type: "bool",
                    desc: ""
                },
                {
                    name: "has_url",
                    type: "bool",
                    desc: ""
                },
                {
                    name: "verb",
                    type: "array(verb)",
                    desc: ""
                },

            ]
        },
        {
            name: 'role',
            desc: 'Triggers when a member\'s roles are updated in your server.'
        },
        {
            name: 'button',
            desc: 'Creates a button that triggers when clicked.'
        },
        {
            name: 'access',
            desc: 'Triggers when a user joins or leaves your server.'
        },
        {
            name: 'Thread',
            desc: 'Triggers when a thread is created, edited, archived, or deleted.',
            disabled: true,
            extended_desc: "⚠️ Not yet available."
        },
        {
            name: 'Ticket',
            desc: 'Triggers when a new ticket is created, edited, deleted, or closed.'
        },
        {
            name: 'HTTP POST',
            desc: 'Triggers when you send ComfyAI an HTTP Post. This is intended for advanced users.'
        },
        {
            name: 'Social Contract',
            disabled: true,
            desc: 'Scans all incoming messages, usernames, and other factors in your server for hate speech & rude or aggressive behavior. Triggers when a configurable threshold is exceeded',
            extended_desc: "⚠️ Not yet available. Due to the extreme cost of AI capable GPUs this feature is only for paid users. Never fully rely on AI to moderate your community. It's a good first line of defense but we suggest you use it only to flag things for review."
        },
        {
            name: 'loggable',
            desc: 'Triggers when any event that is eligible to be logged occurs.',
            extended_desc: '⚠️ Due to poor design decisions made by Discord, logging puts a tremendous amount of stress on our CPUs and disks. Please don\'t use the logging automation if you don\'t need it, and if you do please consider donating. If you have a massive server with over 30,000 members please speak to us before using logging.'
        },
        {
            name: 'system',
            desc: 'Triggers when ComfyAI has an internal system alert.',
            extended_desc: 'Useful for defining which channel system alerts are posted to, versus the default of the first channel Comfy can find in the channel list. Does not count towards automation limit.'
        },

    ]
}