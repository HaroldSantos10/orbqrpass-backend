import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private resend = new Resend(process.env.RESEND_API_KEY);

    async sendStaffInvitation(email:string, eventName: string, token: string) {
        const link = `${process.env.FRONTEND_URL}/staff/invite?token=${token}`;

        await this.resend.emails.send({
            from: 'OrbQRpass <onboarding@resend.dev>',
            to: "haroldsant10.10@gmail.com",
            subject: `Fuiste invitado como staff en ${eventName}`,
            html: `
                <h2>Hola, fuiste invitado como staff</h2>
                <p>Evento: <strong>${eventName}</strong></p>
                <a href="${link}">Activar cuenta</a>
                <p>Este link expira en 24 horas.</p>
            `,
        });

    }

}



