import React from 'react'
import Link from 'gatsby-link'
import Amplify from 'aws-amplify'
import configuration from '../aws-exports'
import { withAuthenticator } from 'aws-amplify-react'
Amplify.configure(configuration);

const IndexPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link>
  </div>
)

export default withAuthenticator(IndexPage)
