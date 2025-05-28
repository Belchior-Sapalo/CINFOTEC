import { getStatus, getStyle, formatedDate } from "@/shared/functions";
import type { IEnrollment, IStudent } from "@/types/enrollment";
import { ViewFileDialog, ConfirmActionDialog } from "./ui/Dialogs";
import { EnrollmentCard } from "./ui/enrollment";
import {
  handleApproveEnrollment,
  handleDeleteEnrollment,
  handleRejectEnrollment,
} from "@/api/EnrollServices";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { FaIdCard, FaPhone, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function RenderEnrollments({
  enrollments,
  onReload,
  fromAdmin,
}: {
  enrollments: IEnrollment[];
  onReload: Function;
  fromAdmin: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  async function deleteEnrollment(id: string) {
    setLoading(true);
    await handleDeleteEnrollment(id)
      .then((res) => {
        onReload();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(true);
      });
  }

  async function rejectEnrollment(id: string) {
    setLoading(true);
    await handleRejectEnrollment(id)
      .then((res) => {
        onReload();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function approveEnrollment(id: string) {
    setLoading(true);
    await handleApproveEnrollment(id)
      .then((res) => {
        console.log(res);
        onReload();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="grid gap-6 px-4 pb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {enrollments?.map((enrollment) => {
        const { id, course, status, createdAt, processedAt, files } = enrollment;
        const statusText = getStatus(status);
        const statusStyle = getStyle(status);
        const formattedCreatedAt = formatedDate(createdAt);
        const formattedProcessedAt = processedAt ? formatedDate(processedAt!) : null
        const student: IStudent = enrollment.student;

        return (
          <EnrollmentCard.Container
            key={id}
            className="flex flex-col border rounded-2xl shadow-sm bg-white overflow-hidden transition hover:shadow-lg"
          >
            <EnrollmentCard.Header className="bg-gray-800 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold truncate">{course.title}</h2>
              <span
                className={`text-[12px] px-2 py-0.5 rounded-full font-bold ${statusStyle}`}
              >
                {statusText}
              </span>
            </EnrollmentCard.Header>

            <EnrollmentCard.Content className="flex flex-col gap-4 p-4">
              <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900"><FaUser/></span>{" "}
                  {student.name || (
                    <span className="italic text-gray-400">Não informado</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900"><MdEmail/></span>{" "}
                  {student.email || (
                    <span className="italic text-gray-400">Não informado</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">
                    <FaIdCard/>
                  </span>{" "}
                  {student.bi || (
                    <span className="italic text-gray-400">Não informado</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900"><FaPhone/></span>{" "}
                  {student.phoneNumber || (
                    <span className="italic text-gray-400">Não informado</span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Data da inscrição:{" "}
                <span className="font-medium text-black">{formattedCreatedAt}</span>
              </div>
              {status === "APPROVER" && <div className="text-sm text-gray-600">
                Data da aprovação:{" "}
                <span className="font-medium text-black">{formattedProcessedAt}</span>
              </div>}
              {status === "REJECTED" && <div className="text-sm text-gray-600">
                Data da rejeição:{" "}
                <span className="font-medium text-black">{formattedProcessedAt}</span>
              </div>}
              {files?.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Documentos ({files.length})
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 flex flex-col items-start gap-2">
                    {files.map((file) => (
                      <DropdownMenuItem key={file.id} asChild>
                        <ViewFileDialog
                          downloadLink={file.downloadLink}
                          type={file.type}
                        />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </EnrollmentCard.Content>

            <EnrollmentCard.Footer className="border-t px-4 py-3 bg-gray-50">
              <EnrollmentCard.ActionsContainer className="flex justify-end gap-2">
                {!fromAdmin && status === "PENDING" && (
                  <EnrollmentCard.Action className="">
                    <ConfirmActionDialog
                      tooltipContent="Cancelar inscrição"
                      onConfirm={() => deleteEnrollment(id)}
                    >
                      <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition">
                        Cancelar
                      </button>
                    </ConfirmActionDialog>
                  </EnrollmentCard.Action>
                )}

                {fromAdmin && status === "PENDING" && (
                  <>
                    <EnrollmentCard.Action className="">
                      <ConfirmActionDialog
                        tooltipContent="Rejeitar inscrição"
                        onConfirm={() => rejectEnrollment(id)}
                      >
                        <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition">
                          Rejeitar
                        </button>
                      </ConfirmActionDialog>
                    </EnrollmentCard.Action>

                    <EnrollmentCard.Action className="">
                      <ConfirmActionDialog
                        tooltipContent="Aprovar inscrição"
                        onConfirm={() => approveEnrollment(id)}
                      >
                        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition">
                          Aprovar
                        </button>
                      </ConfirmActionDialog>
                    </EnrollmentCard.Action>
                  </>
                )}
              </EnrollmentCard.ActionsContainer>
            </EnrollmentCard.Footer>
          </EnrollmentCard.Container>
        );
      })}
    </div>
  );
}
