import { Typography } from '@mui/material';

interface TruncatedDescriptionProps {
    description: string;
}

export default function TruncatedDescription({
    description,
}: TruncatedDescriptionProps) {
    const maxChars = 80;
    const truncatedDesktopDescription =
        description.length > maxChars ? `${description.slice(0, maxChars).trim()}...` : description;

    return (
        <Typography
            variant="body2"
            className="
                        text-gray-600 text-sm leading-snug
                        max-sm:line-clamp-2 max-sm:overflow-hidden max-sm:text-ellipsis
                        sm:block
                    "
        >
            <span className="sm:hidden">{description}</span>
            <span className="hidden sm:inline">{truncatedDesktopDescription}</span>
        </Typography>
    );
}
