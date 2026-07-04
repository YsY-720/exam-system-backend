import * as crypto from "crypto";

export function md5(str: string) {
  const hash = crypto.createHash("md5");
  hash.update(str);
  return hash.digest();
}

export function getCaptchaEmailHtml(code: string, options: { title: string; description: string }) {
  return `
      <div style="margin:0;padding:32px 16px;background:#f6f8fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Helvetica Neue',sans-serif;color:#1f2937;">
        <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.08);">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#4f46e5,#06b6d4);color:#ffffff;">
            <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;">${ options.title }</h1>
            <p style="margin:8px 0 0;font-size:14px;opacity:.9;">${ options.description }</p>
          </div>
          <div style="padding:32px;text-align:center;">
            <p style="margin:0 0 18px;font-size:15px;color:#4b5563;">你的验证码是</p>
            <div style="display:inline-block;padding:14px 28px;border-radius:14px;background:#eef2ff;color:#3730a3;font-size:32px;font-weight:800;letter-spacing:8px;line-height:1;">${ code }</div>
            <p style="margin:22px 0 0;font-size:14px;color:#6b7280;line-height:1.7;">验证码 5 分钟内有效，请勿泄露给他人。<br />如果不是你本人操作，请忽略此邮件。</p>
          </div>
        </div>
      </div>
    `;
}