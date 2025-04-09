
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building, Pencil, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Link } from "react-router-dom";
import { Company } from "@/lib/types";

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

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>Beskrivelse</TableHead>
            <TableHead>Kontaktperson</TableHead>
            <TableHead>Tilføjet</TableHead>
            <TableHead>Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />
                  {company.name}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {company.description ? (
                  <span title={company.description}>
                    {company.description.length > 50
                      ? `${company.description.substring(0, 50)}...`
                      : company.description}
                  </span>
                ) : (
                  <span className="text-gray-400">Ingen beskrivelse</span>
                )}
              </TableCell>
              <TableCell>
                {company.contact_person || <span className="text-gray-400">Ingen</span>}
              </TableCell>
              <TableCell>
                {company.created_at
                  ? new Date(company.created_at).toLocaleDateString("da-DK")
                  : ""}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Rediger virksomhed"
                    asChild
                  >
                    <Link to={`/company/${company.id}/edit`}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Rediger</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Slet virksomhed"
                    onClick={() => handleDeleteClick(company.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting && companyToDelete === company.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Slet</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
    </div>
  );
};

export default CompanyListComponent; 
