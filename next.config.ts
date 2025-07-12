import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    domains: ['img.freepik.com', 'learn-s3-uploader.s3.ap-southeast-1.amazonaws.com']
  }
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
