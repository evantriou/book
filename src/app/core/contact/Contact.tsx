import Show from './Show';
import Email from './Email';

function Contact() {

  return (
    <>
      <div className = 'Contact'>
        <Show/>
        <Email/>
      </div>
      <div className = 'ContactLogosBar'>
        <div>
          LINKEDIN
        </div>
        <div>
          GIT
        </div>
        <div>
          GMAIL
        </div>
      </div>
    </>
  );
}

export default Contact;