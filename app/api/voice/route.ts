import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const to = formData.get('To') as string;

        const twiml = new VoiceResponse();

        if (to) {
            // If there's a 'To' parameter, make an outbound call
            const dial = twiml.dial({
                callerId: process.env.TWILIO_PHONE_NUMBER,
            });

            // Check if it's a phone number or client name
            if (to.startsWith('client:')) {
                dial.client(to.replace('client:', ''));
            } else {
                dial.number(to);
            }
        } else {
            // If no 'To' parameter, this is an incoming call
            twiml.say('Bienvenido al centro de llamadas. Por favor espere mientras lo conectamos con un agente.');

            const dial = twiml.dial();
            dial.client('agent'); // Route to the agent client
        }

        return new NextResponse(twiml.toString(), {
            headers: {
                'Content-Type': 'text/xml',
            },
        });
    } catch (error) {
        console.error('Error generating TwiML:', error);
        const twiml = new VoiceResponse();
        twiml.say('Lo sentimos, ha ocurrido un error. Por favor intente más tarde.');

        return new NextResponse(twiml.toString(), {
            headers: {
                'Content-Type': 'text/xml',
            },
            status: 500,
        });
    }
}
