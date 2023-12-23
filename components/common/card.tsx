type CardProps = {
  children: React.ReactNode
}

export const Card = ({ children }: CardProps) => (
  <div className="flex flex-col gap-2 p-4 border rounded-md">{children}</div>
)
