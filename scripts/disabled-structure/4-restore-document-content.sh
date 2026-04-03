#!/bin/bash                                                                                                                                                 
# 4-restore-document-content.sh                       
# Usage: ./4-restore-document-content.sh <structure_id> <source_db_url> <target_db_url>
                                                                                                                                                            
STRUCTURE_ID=$1
SOURCE_DB=$2                                                                                                                                                
TARGET_DB=$3                                          

psql "$SOURCE_DB" -c "\COPY (                                                                                                                               
  SELECT dc.id, dc.document_key, dc.content
  FROM document_content dc                                                                                                                                  
  JOIN document d ON dc.document_key = d.key          
  JOIN beneficiary b ON d.beneficiary_id = b.id
  WHERE b.structure_id = '$STRUCTURE_ID'                                                                                                                    
) TO STDOUT (FORMAT binary)" \
| psql "$TARGET_DB" -c "\COPY document_content (id, document_key, content) FROM STDIN (FORMAT binary)"