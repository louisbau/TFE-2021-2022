const fixtureMessages = {
    "Messages" : [
        {
            id: '1',
            users: [
                {
                    id: '1',
                    name: 'Vadim',
                    imageUri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg',
                }, 
                {
                    id: '2',
                    name: 'Elon Musk',
                    imageUri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png',
                }
            ],
            messages: [
                {
                    id: '1',
                    content: 'How are you, Elon!',
                    createdAt: '2020-10-10T12:48:00.000Z',
                    user: {
                        id: '1',
                        name: 'Vadim',
                    },
                },
                {
                    id: '2',
                    content: 'I am good, good',
                    createdAt: '2020-10-03T14:49:00.000Z',
                    user: {
                        id: '2',
                        name: 'Elon Musk',
                    },
                }, 
                {
                    id: '3',
                    content: 'What about you?',
                    createdAt: '2020-10-03T14:49:40.000Z',
                    user: {
                        id: '2',
                        name: 'Elon Musk',
                    },
                }, 
                {
                    id: '4',
                    content: 'Good as well, preparing for the stream now.',
                    createdAt: '2020-10-03T14:50:00.000Z',
                    user: {
                        id: '1',
                        name: 'Vadim',
                    },
                },
                {
                    id: '5',
                    content: 'How is SpaceX doing?',
                    createdAt: '2020-10-03T14:51:00.000Z',
                    user: {
                        id: '1',
                        name: 'Vadim',
                    },
                }, 
                {
                    id: '6',
                    content: 'going to the Moooooon',
                    createdAt: '2020-10-03T14:49:00.000Z',
                    user: {
                        id: '2',
                        name: 'Elon Musk',
                    },
                }, 
                {
                    id: '7',
                    content: 'btw, SpaceX is interested in buying notJust.dev!',
                    createdAt: '2020-10-03T14:53:00.000Z',
                    user: {
                        id: '2',
                        name: 'Elon Musk',
                    },
                }
            ]
        }
    ]
}

module.exports = fixtureMessages