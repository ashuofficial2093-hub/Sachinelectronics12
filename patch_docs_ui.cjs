const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const oldDocsGrid = `<div className="grid grid-cols-2 gap-4">
                           {app.documents?.photo && (`;
const newDocsGrid = `<div className="w-full">
                          <details className="group">
                            <summary className="list-none cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-semibold text-sm transition-colors border border-indigo-200">
                              📄 Review Documents
                            </summary>
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                           {app.documents?.photo && (`;

const oldDocsEnd = `)}
                        </div>
                      </div>
                    </div>`;
const newDocsEnd = `)}
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>`;

if (code.includes('<div className="grid grid-cols-2 gap-4">') && code.includes('{app.documents?.photo && (')) {
  // Replace the start
  code = code.replace(oldDocsGrid, newDocsGrid);
  // Replace the end (we can just find the end of the map block)
  // Wait, oldDocsEnd is a bit tricky to match perfectly.
  code = code.replace(oldDocsEnd, newDocsEnd);
  fs.writeFileSync('src/components/Admin.tsx', code);
  console.log('Patched documents UI');
} else {
  console.log('Could not find documents UI');
}
