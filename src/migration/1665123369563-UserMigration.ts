import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UserMigration1665123369563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE USER");
        await queryRunner.addColumn("User", new TableColumn({
            name: 'id',
            type: 'uint256',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
