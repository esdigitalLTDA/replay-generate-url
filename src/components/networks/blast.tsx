export function Blast(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} aria-labelledby="titleID" {...props}>
      <rect rx={6} fill="#1B1B1B" width={20} height={20} />
      <rect rx={6} fill="rgba(252, 252, 3, 0.12)" width={20} height={20} />
      <svg
        width={20}
        height={20}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M31.553 17.81l-4.088 2.037-.028.055 2.777 2.038-1.48 4.576-4.143 2.052 2.483-7.633h-8.846l.851-2.651h8.846l1.173-3.628H7.038l4.339-3.223h18.767l2.819 2.05-1.41 4.326z"
          fill="#FCFC03"
        />
        <path
          d="M15.828 17.335l-2.554 7.953h12.384l-1.067 3.28H8.739l4.256-13.354 2.833 2.121z"
          fill="#FCFC03"
        />
      </svg>
    </svg>
  )
}
