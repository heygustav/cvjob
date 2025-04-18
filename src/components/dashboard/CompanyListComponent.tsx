
import React, { useState, useMemo } from "react";
import { Company } from "@/lib/types";
import { Building, Pencil, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { VirtualizedTable } from "@/components/ui/virtualized-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import IconButton from "@/components/ui/icon-button";

interface CompanyListComponentProps {
  companies: Company[];
  isDeleting: boolean;
  onCompanyDelete: (id: string) => void;
}

const CompanyListComponent: React.FC<CompanyListComponentProps> = ({
  companies,
  isDeleting,
  onCompanyDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  const handleDeleteClick = (companyId: string) => {
    setCompanyToDelete(companyId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      onCompanyDelete(companyToDelete);
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const columns = useMemo(() => [
    {
      header: "Navn",
      key: "name",
      render: (company: Company) => (
        <div className="flex items-center">
          <Building className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />
          {company.name}
        </div>
      ),
    },
    {
      header: "Beskrivelse",
      key: "description",
      render: (company: Company) => (
        company.description ? (
          <span title={company.description}>
            {company.description.length > 50
              ? `${company.description.substring(0, 50)}...`
              : company.description}
          </span>
        ) : (
          <span className="text-gray-400">Ingen beskrivelse</span>
        )
      ),
    },
    {
      header: "Kontaktperson",
      key: "contact",
      render: (company: Company) => 
        company.contact_person || <span className="text-gray-400">Ingen</span>,
    },
    {
      header: "Tilføjet",
      key: "created",
      render: (company: Company) => 
        company.created_at
          ? new Date(company.created_at).toLocaleDateString("da-DK")
          : "",
    },
    {
      header: "Handlinger",
      key: "actions",
      render: (company: Company) => (
        <div className="flex items-center space-x-2">
          <Link to={`/company/${company.id}/edit`}>
            <IconButton
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Rediger virksomhed"
              icon={<Pencil className="h-4 w-4" />}
            />
          </Link>
          <IconButton
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Slet virksomhed"
            onClick={() => handleDeleteClick(company.id)}
            disabled={isDeleting}
            icon={isDeleting && companyToDelete === company.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          />
        </div>
      ),
    },
  ], [isDeleting, companyToDelete, handleDeleteClick]);

  if (companies.length === 0) {
    return null;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <VirtualizedTable
          data={companies}
          columns={columns}
          estimateSize={60}
        />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertCircle className="h-6 w-6 text-red-500 mb-2" aria-hidden="true" />
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Denne handling kan ikke fortrydes. Dette vil permanent slette virksomheden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuller</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sletter...
                </>
              ) : (
                "Slet virksomhed"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CompanyListComponent;
