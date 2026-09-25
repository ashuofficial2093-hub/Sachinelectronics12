const fs = require('fs');

let aaCode = fs.readFileSync('src/components/AreaAdminDashboard.tsx', 'utf8');

const columnInsert = `                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              {c?.status !== "COMPLETED" && (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={selectedTechs[c.id] || ""}
                                    onChange={(e) => setSelectedTechs({ ...selectedTechs, [c.id]: e.target.value })}
                                    className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm flex-1 min-w-[120px]"
                                  >
                                    <option value="">Select Tech...</option>
                                    {technicians?.map((t: any) => (
                                      <option key={t.id} value={t.id}>
                                        {t.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleAssignTech(c.id, selectedTechs[c.id])}
                                    disabled={!selectedTechs[c.id]}
                                    className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                  >
                                    Assign Tech
                                  </button>
                                </div>
                              )}
                              {c?.status === "Assigned" && c?.assignedTechnicianName && (
                                <p className="text-xs font-bold text-slate-500">
                                  Assigned to: {c.assignedTechnicianName}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">`;

aaCode = aaCode.replace(/<\/td>\s*<td className="px-6 py-4">\s*<div className="flex flex-col gap-2">\s*<a\s*href={`https:\/\/wa.me\/91\$\{c\?\.phone\}`}/, `</td>\n${columnInsert}\n                            <div className="flex flex-col gap-2">\n                              <a\n                                href={\`https://wa.me/91\${c?.phone}\`}`);

fs.writeFileSync('src/components/AreaAdminDashboard.tsx', aaCode);
