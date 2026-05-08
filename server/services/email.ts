// Sistema de Email Completo - PlanoCerto
// Em produção, usar SendGrid, AWS SES ou Resend

export type EmailTemplate = 
  | 'welcome'
  | 'price-alert'
  | 'new-plan'
  | 'newsletter'
  | 'password-reset'
  | 'email-verification'
  | 'payment-confirmation'
  | 'subscription-reminder';

export interface EmailData {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

class EmailService {
  private apiKey: string = process.env.EMAIL_API_KEY || '';
  private fromEmail: string = 'noreply@planocerto.com.br';
  private fromName: string = 'PlanoCerto';

  // Enviar email
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const html = this.renderTemplate(emailData.template, emailData.data);
      
      // Em produção, usar API real (SendGrid, AWS SES, etc)
      console.log('📧 Email enviado:', {
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
      });

      // Simular envio
      await this.simulateSend(emailData.to, emailData.subject, html);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  // Enviar email de boas-vindas
  async sendWelcomeEmail(userName: string, userEmail: string): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: '👋 Bem-vindo ao PlanoCerto!',
      template: 'welcome',
      data: { userName },
    });
  }

  // Enviar alerta de preço
  async sendPriceAlert(
    userEmail: string,
    planName: string,
    oldPrice: number,
    newPrice: number,
    planUrl: string
  ): Promise<boolean> {
    const savings = oldPrice - newPrice;
    return this.sendEmail({
      to: userEmail,
      subject: `💰 Alerta: ${planName} baixou de preço!`,
      template: 'price-alert',
      data: { planName, oldPrice, newPrice, savings, planUrl },
    });
  }

  // Enviar notificação de novo plano
  async sendNewPlanEmail(
    userEmail: string,
    planName: string,
    operadora: string,
    price: number,
    planUrl: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: `🆕 Novo plano disponível: ${planName}`,
      template: 'new-plan',
      data: { planName, operadora, price, planUrl },
    });
  }

  // Enviar newsletter semanal
  async sendWeeklyNewsletter(
    userEmail: string,
    userName: string,
    highlights: Array<{
      title: string;
      description: string;
      url: string;
    }>
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: '📰 Newsletter Semanal - PlanoCerto',
      template: 'newsletter',
      data: { userName, highlights },
    });
  }

  // Enviar email de recuperação de senha
  async sendPasswordResetEmail(
    userEmail: string,
    resetToken: string,
    resetUrl: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: '🔐 Recuperação de Senha - PlanoCerto',
      template: 'password-reset',
      data: { resetToken, resetUrl },
    });
  }

  // Enviar email de verificação
  async sendEmailVerification(
    userEmail: string,
    verificationToken: string,
    verificationUrl: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: '✉️ Verifique seu email - PlanoCerto',
      template: 'email-verification',
      data: { verificationToken, verificationUrl },
    });
  }

  // Enviar confirmação de pagamento
  async sendPaymentConfirmation(
    userEmail: string,
    userName: string,
    planName: string,
    amount: number,
    invoiceUrl: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: '✅ Pagamento Confirmado - PlanoCerto',
      template: 'payment-confirmation',
      data: { userName, planName, amount, invoiceUrl },
    });
  }

  // Enviar lembrete de assinatura
  async sendSubscriptionReminder(
    userEmail: string,
    userName: string,
    daysUntilExpiry: number,
    renewUrl: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: '⏰ Lembrete: Sua assinatura expira em breve',
      template: 'subscription-reminder',
      data: { userName, daysUntilExpiry, renewUrl },
    });
  }

  // Renderizar template
  private renderTemplate(template: EmailTemplate, data: Record<string, any>): string {
    const templates: Record<EmailTemplate, (data: any) => string> = {
      welcome: (d) => this.welcomeTemplate(d),
      'price-alert': (d) => this.priceAlertTemplate(d),
      'new-plan': (d) => this.newPlanTemplate(d),
      newsletter: (d) => this.newsletterTemplate(d),
      'password-reset': (d) => this.passwordResetTemplate(d),
      'email-verification': (d) => this.emailVerificationTemplate(d),
      'payment-confirmation': (d) => this.paymentConfirmationTemplate(d),
      'subscription-reminder': (d) => this.subscriptionReminderTemplate(d),
    };

    return templates[template](data);
  }

  // Templates HTML

  private welcomeTemplate(data: { userName: string }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1f6feb, #4a9eff); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #1f6feb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 Bem-vindo ao PlanoCerto!</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${data.userName}</strong>,</p>
            <p>Estamos muito felizes em ter você conosco! 🎉</p>
            <p>O PlanoCerto é a melhor plataforma para comparar planos de saúde para MEI e autônomos.</p>
            <h3>O que você pode fazer:</h3>
            <ul>
              <li>🔍 Buscar planos por preço e localização</li>
              <li>⚖️ Comparar até 3 planos lado a lado</li>
              <li>🔔 Criar alertas de preço</li>
              <li>💾 Salvar seus filtros favoritos</li>
              <li>⭐ Marcar planos como favoritos</li>
            </ul>
            <a href="https://planocerto.com.br/buscar" class="button">Começar Agora</a>
            <p>Se tiver dúvidas, estamos aqui para ajudar!</p>
          </div>
          <div class="footer">
            <p>PlanoCerto - Compare planos de saúde para MEI e autônomos</p>
            <p><a href="https://planocerto.com.br">planocerto.com.br</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private priceAlertTemplate(data: {
    planName: string;
    oldPrice: number;
    newPrice: number;
    savings: number;
    planUrl: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .price-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
          .old-price { text-decoration: line-through; color: #999; font-size: 18px; }
          .new-price { color: #10b981; font-size: 32px; font-weight: bold; }
          .savings { background: #10b981; color: white; padding: 10px; border-radius: 5px; display: inline-block; margin-top: 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Alerta de Preço!</h1>
          </div>
          <div class="content">
            <p>Ótimas notícias! O plano que você acompanha baixou de preço:</p>
            <h2>${data.planName}</h2>
            <div class="price-box">
              <div class="old-price">De: R$ ${data.oldPrice.toFixed(2)}/mês</div>
              <div class="new-price">Por: R$ ${data.newPrice.toFixed(2)}/mês</div>
              <div class="savings">Economize R$ ${data.savings.toFixed(2)}/mês</div>
            </div>
            <p>Não perca essa oportunidade! Aproveite enquanto o preço está baixo.</p>
            <a href="${data.planUrl}" class="button">Ver Plano Agora</a>
          </div>
          <div class="footer">
            <p>PlanoCerto - Alertas de Preço</p>
            <p><a href="https://planocerto.com.br/dashboard">Gerenciar Alertas</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private newPlanTemplate(data: {
    planName: string;
    operadora: string;
    price: number;
    planUrl: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .plan-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🆕 Novo Plano Disponível!</h1>
          </div>
          <div class="content">
            <p>Temos um novo plano que pode interessar você:</p>
            <div class="plan-box">
              <h2>${data.planName}</h2>
              <p><strong>Operadora:</strong> ${data.operadora}</p>
              <p><strong>Preço:</strong> R$ ${data.price.toFixed(2)}/mês</p>
            </div>
            <p>Confira os detalhes e veja se é o plano ideal para você!</p>
            <a href="${data.planUrl}" class="button">Ver Detalhes</a>
          </div>
          <div class="footer">
            <p>PlanoCerto - Novos Planos</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private newsletterTemplate(data: {
    userName: string;
    highlights: Array<{ title: string; description: string; url: string }>;
  }): string {
    const highlightsHtml = data.highlights
      .map(
        (h) => `
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 3px solid #1f6feb;">
          <h3 style="margin: 0 0 10px 0;">${h.title}</h3>
          <p style="margin: 0 0 10px 0; color: #666;">${h.description}</p>
          <a href="${h.url}" style="color: #1f6feb; text-decoration: none;">Ler mais →</a>
        </div>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1f6feb, #4a9eff); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📰 Newsletter Semanal</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${data.userName}</strong>,</p>
            <p>Aqui estão os destaques desta semana:</p>
            ${highlightsHtml}
            <p style="margin-top: 30px;">Até a próxima semana! 👋</p>
          </div>
          <div class="footer">
            <p>PlanoCerto - Newsletter Semanal</p>
            <p><a href="https://planocerto.com.br/newsletter">Gerenciar Preferências</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private passwordResetTemplate(data: { resetToken: string; resetUrl: string }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444, #f87171); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperação de Senha</h1>
          </div>
          <div class="content">
            <p>Você solicitou a recuperação de senha da sua conta PlanoCerto.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <a href="${data.resetUrl}" class="button">Redefinir Senha</a>
            <div class="warning">
              <strong>⚠️ Importante:</strong> Este link expira em 1 hora. Se você não solicitou esta recuperação, ignore este email.
            </div>
          </div>
          <div class="footer">
            <p>PlanoCerto - Segurança da Conta</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private emailVerificationTemplate(data: {
    verificationToken: string;
    verificationUrl: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1f6feb, #4a9eff); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #1f6feb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Verifique seu Email</h1>
          </div>
          <div class="content">
            <p>Obrigado por se cadastrar no PlanoCerto!</p>
            <p>Para completar seu cadastro, clique no botão abaixo para verificar seu email:</p>
            <a href="${data.verificationUrl}" class="button">Verificar Email</a>
            <p>Após a verificação, você terá acesso completo a todos os recursos.</p>
          </div>
          <div class="footer">
            <p>PlanoCerto - Verificação de Email</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private paymentConfirmationTemplate(data: {
    userName: string;
    planName: string;
    amount: number;
    invoiceUrl: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .payment-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Pagamento Confirmado!</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${data.userName}</strong>,</p>
            <p>Seu pagamento foi confirmado com sucesso! 🎉</p>
            <div class="payment-box">
              <p><strong>Plano:</strong> ${data.planName}</p>
              <p><strong>Valor:</strong> R$ ${data.amount.toFixed(2)}</p>
            </div>
            <p>Você já pode aproveitar todos os benefícios do seu plano Premium!</p>
            <a href="${data.invoiceUrl}" class="button">Ver Fatura</a>
          </div>
          <div class="footer">
            <p>PlanoCerto - Pagamentos</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private subscriptionReminderTemplate(data: {
    userName: string;
    daysUntilExpiry: number;
    renewUrl: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Lembrete de Assinatura</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${data.userName}</strong>,</p>
            <p>Sua assinatura Premium expira em <strong>${data.daysUntilExpiry} dia${data.daysUntilExpiry > 1 ? 's' : ''}</strong>.</p>
            <p>Renove agora para continuar aproveitando:</p>
            <ul>
              <li>🔔 Alertas ilimitados de preço</li>
              <li>⚖️ Comparação ilimitada de planos</li>
              <li>💬 Consultoria via chat</li>
              <li>🚫 Sem anúncios</li>
            </ul>
            <a href="${data.renewUrl}" class="button">Renovar Assinatura</a>
          </div>
          <div class="footer">
            <p>PlanoCerto - Assinaturas</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Simular envio (em produção, usar API real)
  private async simulateSend(to: string, subject: string, html: string): Promise<void> {
    // Salvar em localStorage para demonstração
    const emails = JSON.parse(localStorage.getItem('sent-emails') || '[]');
    emails.push({
      to,
      subject,
      html,
      sentAt: new Date().toISOString(),
    });
    localStorage.setItem('sent-emails', JSON.stringify(emails));
  }
}

export const emailService = new EmailService();
