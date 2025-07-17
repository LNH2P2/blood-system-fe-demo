import { Link } from '../../i18n/navigation'
import './404.css'

function NotFound() {
  return (
    <div className='notfound-wrapper'>
      <div className='noise'></div>
      <div className='overlay'></div>
      <div className='terminal'>
        <h1>
          Error <span className='errorcode'>404</span>
        </h1>
        <p className='output'>
          The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
        </p>
        <p className='output'>
          Please try to{' '}
          <span className='text-white text-underline'>
            {'['}
            <Link href='/'>return to the homepage</Link>
            {']'}
          </span>
        </p>
        <p className='output'>Good luck.</p>
      </div>
    </div>
  )
}

export default NotFound
