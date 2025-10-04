

namespace LaoShanghai.Shared.IO
{
    public static class CsvHelper
    {
        // read file content into DataTable
        public static DataTable Read(string filePath, bool columnNamesInFirstRow)
        {
            string[] lines = File.ReadAllLines(filePath);

            string[] fields;

            // load first row as column row
            fields = lines[0].Split(new char[] { ',' });

            // get count of columns
            var Cols = fields.GetLength(0);

            // create data table
            var dt = new DataTable();

            // load column names
            for (var i = 0; i < Cols; i++)
            {
                if (columnNamesInFirstRow)
                {
                    dt.Columns.Add(fields[i], typeof(string));
                }
                else
                {
                    dt.Columns.Add("Colunn_" + i.ToString(), typeof(string));
                }

            }

            // if column name in first row, then start from row 1 else from row 0
            var rowStartIndex = columnNamesInFirstRow ? 1 : 0;

            DataRow row;
            for (var i = rowStartIndex; i < lines.GetLength(0); i++)
            {
                fields = lines[i].Split(new[] { ',' });

                // create new row
                row = dt.NewRow();

                for (int f = 0; f < Cols; f++)
                {
                    // populate cell value 
                    row[f] = fields[f];
                }

                dt.Rows.Add(row);
            }

            return dt;
        }

        // write content into a csv from DataTable
        public static void Write(DataTable dt, string filePath, bool IsUsingDoubleQuote)
        {
            var content = new StringBuilder();

            if (dt.Rows.Count > 0)
            {
                var dr1 = dt.Rows[0]; // first row as the column row
                var intColumnCount = dr1.Table.Columns.Count;
                var index = 1;

                //add column names
                foreach (DataColumn item in dr1.Table.Columns)
                {
                    if (IsUsingDoubleQuote)
                    {
                        content.Append(String.Format("\"{0}\"", item.ColumnName));
                    }
                    else
                    {
                        content.Append(String.Format("{0}", item.ColumnName));
                    }


                    if (index < intColumnCount)
                    {
                        content.Append(",");
                    }

                    else
                    {
                        content.Append("\r\n");
                    }

                    index++;
                }

                //add column data
                foreach (DataRow currentRow in dt.Rows)
                {
                    var strRow = string.Empty;
                    for (var y = 0; y <= intColumnCount - 1; y++)
                    {
                        if (IsUsingDoubleQuote)
                        {
                            strRow += "\"" + currentRow[y].ToString() + "\"";
                        }
                        else
                        {
                            strRow += currentRow[y].ToString();
                        }


                        if (y < intColumnCount - 1 && y >= 0)
                        {
                            strRow += ",";
                        }

                    }
                    content.Append(strRow + "\r\n");
                }
            }

            File.WriteAllText(filePath, content.ToString());
        }
    }
}
