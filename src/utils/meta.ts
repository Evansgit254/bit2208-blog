interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
}

export function updateMeta({ 
  title = 'BIT2208 Blog', 
  description = 'A modern blog platform built with React and Firebase', 
  image = '/og-image.png'
}: MetaProps) {
  const siteTitle = title === 'BIT2208 Blog' ? title : `${title} | BIT2208 Blog`;
  
  // Update title
  document.title = siteTitle;
  
  // Update meta tags
  updateMetaTag('description', description);
  
  // Open Graph
  updateMetaTag('og:title', siteTitle);
  updateMetaTag('og:description', description);
  updateMetaTag('og:image', image);
  updateMetaTag('og:url', window.location.href);
  
  // Twitter
  updateMetaTag('twitter:title', siteTitle);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', image);
  updateMetaTag('twitter:url', window.location.href);
}

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  }
  
  if (element) {
    element.content = content;
  } else {
    element = document.createElement('meta');
    if (name.startsWith('og:')) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    element.content = content;
    document.head.appendChild(element);
  }
}