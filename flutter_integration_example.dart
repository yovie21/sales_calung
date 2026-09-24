import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Ganti dengan URL Vercel setelah di-deploy
  static const String baseUrl = 'https://sales-calung.vercel.app/api';

  static Future<List<dynamic>> getProducts() async {
    final response = await http.get(Uri.parse('$baseUrl/products'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Gagal memuat produk');
    }
  }

  static Future<List<dynamic>> getPharmacies() async {
    final response = await http.get(Uri.parse('$baseUrl/pharmacies'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Gagal memuat apotek');
    }
  }

  static Future<List<dynamic>> getConsignments() async {
    final response = await http.get(Uri.parse('$baseUrl/consignments'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Gagal memuat nota');
    }
  }

  static Future<void> createConsignment(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/consignments'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) {
      throw Exception('Gagal membuat nota');
    }
  }
}
