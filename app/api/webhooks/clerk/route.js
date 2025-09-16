import { NextResponse } from "next/server";
import { Webhook } from "svix";
import connectDb from "@/config/db";
import User from "@/models/User";

export async function POST(request) {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

        if (!WEBHOOK_SECRET) {
            throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
        }

        // Get the headers
        const headerPayload = request.headers;
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        // If there are no headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response('Error occured -- no svix headers', {
                status: 400
            });
        }

        // Get the body
        const payload = await request.json();
        const body = JSON.stringify(payload);

        // Create a new Svix instance with your secret.
        const wh = new Webhook(WEBHOOK_SECRET);

        let evt;

        // Verify the payload with the headers
        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        } catch (err) {
            console.error('Error verifying webhook:', err);
            return new Response('Error occured', {
                status: 400
            });
        }

        // Connect to database
        await connectDb();

        const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = evt.data;
        const eventType = evt.type;

        if (eventType === 'user.created') {
            try {
                // Create user in our database
                const newUser = new User({
                    _id: id,
                    email: email_addresses[0]?.email_address,
                    name: `${first_name || ''} ${last_name || ''}`.trim(),
                    imageUrl: image_url,
                    phone: phone_numbers?.[0]?.phone_number || '',
                    role: 'user',
                    isVerified: false,
                    isActive: true,
                    lastLogin: new Date()
                });

                await newUser.save();
                console.log('User created in database:', id);
            } catch (error) {
                console.error('Error creating user in database:', error);
            }
        }

        if (eventType === 'user.updated') {
            try {
                // Update user in our database
                await User.findByIdAndUpdate(id, {
                    email: email_addresses[0]?.email_address,
                    name: `${first_name || ''} ${last_name || ''}`.trim(),
                    imageUrl: image_url,
                    phone: phone_numbers?.[0]?.phone_number || '',
                    lastLogin: new Date()
                });
                console.log('User updated in database:', id);
            } catch (error) {
                console.error('Error updating user in database:', error);
            }
        }

        if (eventType === 'user.deleted') {
            try {
                // Soft delete user in our database
                await User.findByIdAndUpdate(id, {
                    isActive: false
                });
                console.log('User deactivated in database:', id);
            } catch (error) {
                console.error('Error deactivating user in database:', error);
            }
        }

        return NextResponse.json({ message: 'Webhook processed successfully' });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
