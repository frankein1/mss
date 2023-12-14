-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "item_created_by_id" UUID;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_item_created_by_id_fkey" FOREIGN KEY ("item_created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

update notification n set item_created_by_id = (
  select created_by_id from help_request hr where hr.id = n.help_request_id limit 1
) where n.help_request_id is not null;

update notification n set item_created_by_id = (
  select created_by_id from followup fu where fu.id = n.followup_id limit 1
) where n.followup_id is not null;