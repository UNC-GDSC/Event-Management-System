import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const fromEmail = process.env.EMAIL_FROM || 'noreply@yourdomain.com'

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome, ${name}!</h1>
          <p>Thanks for signing up for ${process.env.NEXT_PUBLIC_APP_NAME}. We're excited to have you on board!</p>
          <p>Here are some next steps to get started:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Explore our features</li>
            <li>Upgrade to a paid plan for more features</li>
          </ul>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendSubscriptionConfirmation(
  to: string,
  name: string,
  plan: string
) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Subscription Confirmed - ${plan} Plan`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Subscription Confirmed!</h1>
          <p>Hi ${name},</p>
          <p>Your subscription to the <strong>${plan} Plan</strong> has been confirmed.</p>
          <p>You now have access to all ${plan} features. Log in to your dashboard to get started!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Go to Dashboard
          </a>
          <p>Thank you for your subscription!</p>
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error)
  }
}

export async function sendSubscriptionCancelled(
  to: string,
  name: string,
  endDate: Date
) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'Subscription Cancelled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Subscription Cancelled</h1>
          <p>Hi ${name},</p>
          <p>Your subscription has been cancelled as requested.</p>
          <p>You'll continue to have access to your current plan features until <strong>${endDate.toLocaleDateString()}</strong>.</p>
          <p>We're sorry to see you go! If you have any feedback or change your mind, you can reactivate your subscription anytime from your dashboard.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Manage Subscription
          </a>
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send cancellation email:', error)
  }
}

export async function sendPaymentFailed(to: string, name: string) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'Payment Failed - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Payment Failed</h1>
          <p>Hi ${name},</p>
          <p>We were unable to process your recent payment. Please update your payment method to continue your subscription.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Update Payment Method
          </a>
          <p>If you don't update your payment method, your subscription will be cancelled.</p>
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send payment failed email:', error)
  }
}

export async function sendReferralCredit(
  to: string,
  name: string,
  credits: number
) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'You Earned Referral Credits!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Congratulations!</h1>
          <p>Hi ${name},</p>
          <p>You've earned <strong>${credits} credits</strong> from a successful referral!</p>
          <p>Keep sharing your referral link to earn more credits.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/referrals" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            View Referrals
          </a>
          <p>Thank you for spreading the word!</p>
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send referral credit email:', error)
  }
}
