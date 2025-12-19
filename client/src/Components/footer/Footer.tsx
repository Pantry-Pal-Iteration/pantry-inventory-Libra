import './footer.css';
// import { Link } from 'react-router-dom';

// const Footer = () => {

//   return (
//     <div className='footer'>Footer</div>
//   )
// }

interface FooterProps {
  user?: string | null;
  onLogout?: () => void;
}



const Footer: React.FC<FooterProps> = ({ user, onLogout }) => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='footer-container'>
        <p className='footer-copyright'>
          &copy; {currentYear} BLOODROOT-FCNY2 <span>🫜</span>
        </p>
        <nav className='footer-nav'>

           {user && onLogout && (
          <button 
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
          {/* <Link to="/" className="footer-link">Home</Link>
          <span>|</span>
          <Link to="/inventory" className="footer-link">Inventory</Link> */}
        </nav>
        <p>Built with MongoDB, Express, React, Node</p>
      </div>
    </footer>
  );
}
export default Footer;