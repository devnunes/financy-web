import { Link } from 'react-router-dom'

export interface CustomLinkProps extends React.ComponentProps<typeof Link> {
  text: string
}

export default function CustomLink({ text, ...props }: CustomLinkProps) {
  return (
    <Link {...props}>
      <span className="inline-flex items-center text-sm font-medium underline-offset-4 transition-colors text-primary hover:text-primary-dark hover:underline">
        {text}
      </span>
    </Link>
  )
}
