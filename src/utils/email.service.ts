import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export interface EmailData {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
}

export class EmailService {
  private fromEmail: string;

  constructor() {
    this.fromEmail = "manuelito1111@gmail.com";
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      const msg = {
        to: data.to,
        from: this.fromEmail,
        subject: data.subject,
        text: data.text,
        html: data.html,
      };

      await sgMail.send(msg);
      console.log(`Email sent successfully to: ${data.to}`);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof Error) {
        console.error(error.message);
      }
      return false;
    }
  }

  async sendMultipleEmails(emails: EmailData[]): Promise<boolean> {
    try {
      const messages = emails.map((data) => ({
        to: data.to,
        from: this.fromEmail,
        subject: data.subject,
        text: data.text,
        html: data.html,
      }));

      await sgMail.send(messages);
      console.log(`${emails.length} emails sent successfully`);
      return true;
    } catch (error) {
      console.error("Error sending multiple emails:", error);
      if (error instanceof Error) {
        console.error(error.message);
      }
      return false;
    }
  }

  // Template para notificar a aprobadores sobre nueva solicitud
  createSolicitudNotificationEmail(
    toEmail: string,
    solicitudData: {
      id_solicitud: string;
      titulo: string;
      tipo_solicitud: string;
      descripcion: string;
      correo_solicitante: string;
      fecha_solicitud: Date | string;
      centro_costo: number;
    }
  ): EmailData {
    const subject = `Nueva Solicitud: ${solicitudData.titulo}`;

    // Convertir fecha a Date si es string
    const fecha =
      solicitudData.fecha_solicitud instanceof Date
        ? solicitudData.fecha_solicitud
        : new Date(solicitudData.fecha_solicitud);

    const fechaFormateada = fecha.toLocaleDateString();

    const text = `
      Se ha creado una nueva solicitud que requiere su aprobación.
      
      ID: ${solicitudData.id_solicitud}
      Título: ${solicitudData.titulo}
      Tipo: ${solicitudData.tipo_solicitud}
      Descripción: ${solicitudData.descripcion}
      Solicitante: ${solicitudData.correo_solicitante}
      Centro de Costo: ${solicitudData.centro_costo}
      Fecha: ${fechaFormateada}
      
      Por favor, revise y apruebe esta solicitud.
    `;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .footer { margin-top: 20px; padding: 20px; text-align: center; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nueva Solicitud Pendiente</h1>
            </div>
            <div class="content">
              <p>Se ha creado una nueva solicitud que requiere su aprobación.</p>
              
              <div class="info-row">
                <span class="label">ID:</span>
                <span class="value">${solicitudData.id_solicitud}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Título:</span>
                <span class="value">${solicitudData.titulo}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Tipo:</span>
                <span class="value">${solicitudData.tipo_solicitud}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Descripción:</span>
                <span class="value">${solicitudData.descripcion}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Solicitante:</span>
                <span class="value">${solicitudData.correo_solicitante}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Centro de Costo:</span>
                <span class="value">${solicitudData.centro_costo}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Fecha:</span>
                <span class="value">${fechaFormateada}</span>
              </div>
            </div>
            <div class="footer">
              <p>Este es un mensaje automático. Por favor no responda a este correo.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return {
      to: toEmail,
      subject,
      text,
      html,
    };
  }

  // Template para notificar al solicitante sobre cambio de estado
  createEstadoCambioNotificationEmail(
    toEmail: string,
    solicitudData: {
      id_solicitud: string;
      titulo: string;
      tipo_solicitud: string;
      estadoAnterior: string;
      estadoNuevo: string;
      descripcion: string;
      fecha_solicitud: Date | string;
      centro_costo: number;
      comentario_adicional?: string;
    }
  ): EmailData {
    const subject = `Cambio de Estado en su Solicitud: ${solicitudData.titulo}`;

    // Convertir fecha a Date si es string
    const fecha =
      solicitudData.fecha_solicitud instanceof Date
        ? solicitudData.fecha_solicitud
        : new Date(solicitudData.fecha_solicitud);

    const fechaFormateada = fecha.toLocaleDateString();

    const text = `
      El estado de su solicitud ha sido actualizado.
      
      ID: ${solicitudData.id_solicitud}
      Título: ${solicitudData.titulo}
      Tipo: ${solicitudData.tipo_solicitud}
      Descripción: ${solicitudData.descripcion}
      
      Estado Anterior: ${solicitudData.estadoAnterior}
      Estado Nuevo: ${solicitudData.estadoNuevo}
      
      Centro de Costo: ${solicitudData.centro_costo}
      Fecha de Solicitud: ${fechaFormateada}
      ${
        solicitudData.comentario_adicional
          ? `\nComentario Adicional: ${solicitudData.comentario_adicional}`
          : ""
      }
      
      Gracias por su paciencia.
    `;

    const getEstadoColor = (estado: string): string => {
      switch (estado.toLowerCase()) {
        case "aprobado":
        case "aprobada":
          return "#4CAF50"; // Green
        case "rechazado":
        case "rechazada":
          return "#F44336"; // Red
        case "pendiente":
          return "#FF9800"; // Orange
        case "en proceso":
        case "en_proceso":
          return "#2196F3"; // Blue
        default:
          return "#9E9E9E"; // Gray
      }
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: ${getEstadoColor(
              solicitudData.estadoNuevo
            )}; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .estado-change { 
              background-color: #fff; 
              border-left: 4px solid ${getEstadoColor(
                solicitudData.estadoNuevo
              )}; 
              padding: 15px; 
              margin: 20px 0;
            }
            .estado-anterior { 
              text-decoration: line-through; 
              color: #999; 
            }
            .estado-nuevo { 
              color: ${getEstadoColor(solicitudData.estadoNuevo)}; 
              font-weight: bold; 
              font-size: 1.2em;
            }
            .footer { margin-top: 20px; padding: 20px; text-align: center; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Actualización de Solicitud</h1>
            </div>
            <div class="content">
              <p>El estado de su solicitud ha sido actualizado.</p>
              
              <div class="info-row">
                <span class="label">ID:</span>
                <span class="value">${solicitudData.id_solicitud}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Título:</span>
                <span class="value">${solicitudData.titulo}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Tipo:</span>
                <span class="value">${solicitudData.tipo_solicitud}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Descripción:</span>
                <span class="value">${solicitudData.descripcion}</span>
              </div>
              
              <div class="estado-change">
                <div class="info-row">
                  <span class="label">Estado Anterior:</span>
                  <span class="value estado-anterior">${
                    solicitudData.estadoAnterior
                  }</span>
                </div>
                <div class="info-row">
                  <span class="label">Estado Nuevo:</span>
                  <span class="value estado-nuevo">${
                    solicitudData.estadoNuevo
                  }</span>
                </div>
              </div>
              
              <div class="info-row">
                <span class="label">Centro de Costo:</span>
                <span class="value">${solicitudData.centro_costo}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Fecha de Solicitud:</span>
                <span class="value">${fechaFormateada}</span>
              </div>
              
              ${
                solicitudData.comentario_adicional
                  ? `
              <div class="info-row">
                <span class="label">Comentario Adicional:</span>
                <span class="value">${solicitudData.comentario_adicional}</span>
              </div>
              `
                  : ""
              }
            </div>
            <div class="footer">
              <p>Este es un mensaje automático. Por favor no responda a este correo.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return {
      to: toEmail,
      subject,
      text,
      html,
    };
  }
}
