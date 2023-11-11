import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid';
import { usePagination } from '@lib/hooks/searchParams';
import { cn } from '@lib/utils';
import { Group } from 'react-aria-components';
import Button from './Button';

const baseClass =
  'rounded duration-75 p-2 w-8 h-8 bg-transparent text-primary-950 disabled:bg-transparent disabled:text-primary-200 hover:bg-primary-200';

export function PaginationBar({ totalCount }: { totalCount: number }) {
  const [{ page, size }, searchParams] = usePagination();
  const totalPages = Math.max(Math.ceil(totalCount / size), 1);
  const maxPages = 7;
  const halfMaxPages = Math.floor(maxPages / 2);
  const canPageBackwards = page > 1;
  const canPageForwards = page < totalPages;
  const pageNumbers = [] as Array<number>;
  if (totalPages <= maxPages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = page - halfMaxPages;
    let endPage = page + halfMaxPages;
    if (startPage < 1) {
      endPage += Math.abs(startPage) + 1;
      startPage = 1;
    }
    if (endPage > totalPages) {
      startPage -= endPage - totalPages;
      endPage = totalPages;
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }
  const existingParams = Array.from(searchParams.entries()).filter(([key]) => {
    return key !== 'page';
  });
  return (
    <>
      {existingParams.map(([key, value]) => {
        return <input key={key} type="hidden" name={key} value={value} />;
      })}
      <Group className="flex items-stretch gap-1">
        <Button
          variant="primary"
          type="submit"
          name="page"
          value="1"
          isDisabled={!canPageBackwards}
          aria-label="First page"
          className={baseClass}
        >
          <ChevronDoubleLeftIcon className="w-4 h-4 mx-auto" />
        </Button>
        <Button
          variant="primary"
          type="submit"
          name="page"
          value={Math.max(page - 1, 1) + ''}
          isDisabled={!canPageBackwards}
          aria-label="Previous page"
          className={baseClass}
        >
          <ArrowLeftIcon className="w-4 h-4 mx-auto" />
        </Button>
        {pageNumbers.map((pageNumber) => {
          const pageSkip = pageNumber;
          const isCurrentPage = pageNumber === page;
          return (
            <Button
              variant="primary"
              type="submit"
              name="page"
              key={pageNumber + ''}
              value={pageSkip + ''}
              aria-label={`Page ${pageNumber}`}
              isDisabled={isCurrentPage}
              className={cn(
                baseClass,
                'disabled:text-primary-50 disabled:bg-primary-950'
              )}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button
          variant="primary"
          type="submit"
          name="page"
          value={Math.min(page + 1, totalPages) + ''}
          isDisabled={!canPageForwards}
          aria-label="Next page"
          className={baseClass}
        >
          <ArrowRightIcon className="w-4 h-4 mx-auto" />
        </Button>
        <Button
          variant="primary"
          type="submit"
          name="page"
          value={totalPages + ''}
          isDisabled={!canPageForwards}
          aria-label="Last page"
          className={baseClass}
        >
          <ChevronDoubleRightIcon className="w-4 h-4 mx-auto" />
        </Button>
      </Group>
    </>
  );
}
