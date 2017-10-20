import nodemailer from 'nodemailer';

export default function email(host, pwd, to, title, content) {
  return new Promise((resolve, reject) => {
    const smtpTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        user: host,//'mywinecellars@gmail.com',
        pass: pwd,//'cavistes',
      },
    });
    const mailOptions = {
      from: host,
      to: to,//'1neptune1@naver.com',
      subject: title,
      text: content,
    };
    smtpTransport.sendMail(mailOptions, (err, res) => {
      if (err) {
        reject({ message: '메일 전송에 오류가 있습니다.', err });
      } else {
        resolve();
      }
      smtpTransport.close();
    });
  });
}
