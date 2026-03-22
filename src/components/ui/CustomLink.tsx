import { Link } from 'react-router-dom'

export interface CustomLinkProps extends React.ComponentProps<typeof Link> {
  text: string
  icon?: React.ReactNode
}

export default function CustomLink({ text, icon, ...props }: CustomLinkProps) {
  return (
    <Link {...props}>
      <span className="inline-flex items-center text-sm/20 font-medium underline-offset-4 transition-colors text-primary hover:text-primary-dark hover:underline">
        {text}
        {icon && <span className="mr-2">{icon}</span>}
      </span>
    </Link>
  )
}
