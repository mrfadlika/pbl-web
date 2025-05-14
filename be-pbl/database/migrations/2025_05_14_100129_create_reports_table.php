<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
            $table->string('userName');
            $table->string('contact');
            $table->text('message');
            $table->text('proofDescription')->nullable();
            $table->json('proofImages')->nullable();
            $table->enum('report_type', ['claim', 'found']); // claim untuk pemilik, found untuk penemu
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->boolean('admin_review')->default(false); // Tandai jika sudah dilempar ke admin
            $table->text('additional_info')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
