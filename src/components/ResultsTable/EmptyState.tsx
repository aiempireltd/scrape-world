import React from 'react';

export function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
        No results found. Start a search to see businesses here.
      </td>
    </tr>
  );
}