/// Copyright (c) Pascal Brand
/// MIT License
///
///

import { Helmet } from 'react-helmet-async';

export default function PbrSEO({ title, description, canonical, addFacebookTag }) {
  return (
    <Helmet>
      { /* Standard metadata tags */}
      { title && <title>{title}</title> }
      { description && <meta name='description' content={description} /> }
      { canonical && <link rel="canonical" href={canonical} /> }

      { /* End standard metadata tags */}

      { addFacebookTag && title && <meta property="og:title" content={title} />}
      { addFacebookTag && description && <meta property="og:description" content={description} />}


    </Helmet>
  )
}
