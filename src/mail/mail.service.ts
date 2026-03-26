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
            to: process.env.MAIL_TEST_TO as string,
            subject: `Fuiste invitado como staff en ${eventName}`,
            html: `
                <h2>Hola, fuiste invitado como staff</h2>
                <p>Evento: <strong>${eventName}</strong></p>
                <a href="${link}">Activar cuenta</a>
                <p>Este link expira en 24 horas.</p>
            `,
        });

    }

    // new method to send tickets with QR code
    async sendTickets(
        email: string,
        buyerName: string,
        eventName: string,
        eventDate: string,
        eventLocation: string,
        qrCodes: string[]
    ) {
        const ticketsHtml = qrCodes
        .map(
            (qr, index) => `
            <div style="margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h3>Ticket #${index + 1}</h3>
            <img src="${qr}" alt="QR Ticket ${index + 1}" style="width: 200px; height: 200px;" />
            <p>Mostrá este QR en la entrada del evento.</p>
            </div>
        `,
        )
        .join('');

        await this.resend.emails.send({
        from: 'OrbQRpass <onboarding@resend.dev>',
        to: process.env.MAIL_TEST_TO as string,
        subject: `Tus tickets para ${eventName}`,
        html: `
            <h2>¡Hola ${buyerName}!</h2>
            <p>Tus tickets para <strong>${eventName}</strong> están listos.</p>
            <p><strong>Fecha:</strong> ${eventDate}</p>
            <p><strong>Lugar:</strong> ${eventLocation}</p>
            <hr />
            ${ticketsHtml}
            <p>Guardá este email y mostrá cada QR al ingresar.</p>
        `,
        });
    }


}



