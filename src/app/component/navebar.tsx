// import '../style/style.css';
import Image from 'next/image';


export default function Navebar() {
    return (
      <div >
        <nav className='navebar'> 
          <div className="nave1">
            <div className='mainlogocontainer'>
              <Image src="/homeImages/mainlogo.svg" alt="Logo"  width={50} height={50} />
              <h1>P<span>O</span>NGy </h1>
            </div>
              <div className='NotificationAlert'>
                <div className='NotificationAlertleft'>
                  <Image className='imageNotification' src="/homeImages/invitation.svg" alt="invitation"  width={40} height={40}/>       
                  <div className='Notificationtext'>
                    <p className='Notificationrname'>Username</p>
                    <p className='Notificationgameterm'>Game Theme</p>
                  </div>
                </div>
                <div className='NotificationAlertright'>
                  <a type='image' className="alertebuttonDeny"  >
                    <Image  src="/homeImages/Deny.svg" alt="Deny"  width={25} height={25} />
                  </a>
                  <a type='image' className="alertebuttonAccept"  >
                    <Image  src="/homeImages/Accept.svg"  alt="accept" width={25} height={25} />
                  </a>
                </div> 
              </div>
          </div>
          <div className="nave2" >
            <div className="notificationborder">
                <Image className="logonotification" src="/homeImages/Notifications.png" alt="notification image"  width={25} height={25}/>  
            </div>
            <div className='UserProfilecontainer'>
              <Image className="UserProfile" src="/homeImages/profile11.svg" alt="user profile image image" width={42} height={42} />  
            </div >
            <div >
              <p className='Profilelvl'>lvl: {10} </p>
            </div>
          </div>
        </nav>
        
    </div>
    );
  }
  
  