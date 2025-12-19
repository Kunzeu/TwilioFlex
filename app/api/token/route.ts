import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export async function POST(request: NextRequest) {
    try {
        const { identity } = await request.json();

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const apiKey = process.env.TWILIO_API_KEY;
        const apiSecret = process.env.TWILIO_API_SECRET;
        const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

        if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
            return NextResponse.json(
                { error: 'Missing Twilio credentials in environment variables' },
                { status: 500 }
            );
        }

        // Create an access token
        const token = new AccessToken(accountSid, apiKey, apiSecret, {
            identity: identity || 'agent',
            ttl: 3600, // Token valid for 1 hour
        });

        // Create a Voice grant
        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: twimlAppSid,
            incomingAllow: true,
        });

        // Add the grant to the token
        token.addGrant(voiceGrant);

        // Serialize the token to a JWT string
        return NextResponse.json({
            token: token.toJwt(),
            identity: identity || 'agent',
        });
    } catch (error) {
        console.error('Error generating token:', error);
        return NextResponse.json(
            { error: 'Failed to generate token' },
            { status: 500 }
        );
    }
}
