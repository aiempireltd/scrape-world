import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Business } from '../../types/business';

interface BusinessRowProps {
  business: Business;
}

export function BusinessRow({ business }: BusinessRowProps) {
  const hasWebsite = business.website && business.website !== 'No website';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {business.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {business.address}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {business.phoneNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {business.email || 'Aucun email'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {business.rating > 0 ? business.rating.toFixed(1) : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {business.reviewCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {hasWebsite ? (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
          >
            Visiter le site <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          'Pas de site web'
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="flex flex-wrap gap-1">
          {business.types?.map((type, index) => (
            <span
              key={`${business.placeId}-${type}-${index}`}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
            >
              {type.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
}