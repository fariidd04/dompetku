import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android'
  ? StatusBar.currentHeight ?? 24
  : 0;

const formatRupiah = (angka) => {
  return 'Rp ' + Math.abs(angka).toLocaleString('id-ID');
};

const ItemTransaksi = ({ item, onHapus }) => {
  const isMasuk = item.tipe === 'masuk';

  // Konfirmasi hapus 1 transaksi
  const konfirmasiHapus = () => {
    Alert.alert(
      'Hapus Transaksi',
      `Hapus "${item.ket}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => onHapus(item.id),
        },
      ]
    );
  };

  return (
    <View style={styles.itemContainer}>
      {/* Ikon tipe transaksi */}
      <View style={[styles.itemIcon, isMasuk ? styles.iconMasuk : styles.iconKeluar]}>
        <Text style={[styles.itemIconText, isMasuk ? styles.iconTextMasuk : styles.iconTextKeluar]}>
          {isMasuk ? '↑' : '↓'}
        </Text>
      </View>

      {/* Deskripsi & Tipe */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemKet}>{item.ket}</Text>
        <Text style={styles.itemTipe}>{isMasuk ? 'Pemasukan' : 'Pengeluaran'}</Text>
      </View>

      {/* Nominal — HIJAU jika masuk, MERAH jika keluar */}
      <Text style={[styles.itemNominal, isMasuk ? styles.nominalMasuk : styles.nominalKeluar]}>
        {isMasuk ? '+' : '-'}{formatRupiah(item.nominal)}
      </Text>

      {/* Tombol Hapus per item */}
      <TouchableOpacity
        style={styles.btnHapusItem}
        onPress={konfirmasiHapus}
        activeOpacity={0.7}
      >
        <Text style={styles.btnHapusItemText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

// KOMPONEN UTAMA: DompetKu
export default function DompetKu() {
  // Saldo awal kosong (array kosong = Rp 0)
  const [transaksi, setTransaksi] = useState([]);
  const [inputKet, setInputKet] = useState('');
  const [inputNominal, setInputNominal] = useState('');

  // LOGIKA HITUNG
  const hitungSaldo = () => {
    return transaksi.reduce((total, item) => {
      return item.tipe === 'masuk' ? total + item.nominal : total - item.nominal;
    }, 0);
  };

  const hitungTotalMasuk = () => {
    return transaksi
      .filter((t) => t.tipe === 'masuk')
      .reduce((total, t) => total + t.nominal, 0);
  };

  const hitungTotalKeluar = () => {
    return transaksi
      .filter((t) => t.tipe === 'keluar')
      .reduce((total, t) => total + t.nominal, 0);
  };

  // FUNGSI: Tambah transaksi
  const tambahTransaksi = (tipe) => {
    if (!inputKet.trim()) {
      Alert.alert('Perhatian', 'Deskripsi tidak boleh kosong!');
      return;
    }
    
    // Hapus titik sebelum diconvert ke tipe number
    const angkaTanpaTitik = inputNominal.replace(/\./g, '');
    const nominal = parseFloat(angkaTanpaTitik);

    if (!nominal || nominal <= 0) {
      Alert.alert('Perhatian', 'Nominal harus lebih dari 0!');
      return;
    }
    
    const transaksiBar = {
      id: Date.now().toString(),
      ket: inputKet.trim(),
      nominal: nominal, // Simpan angka murninya untuk keperluan kalkulasi saldo
      tipe: tipe,
    };
    
    setTransaksi([transaksiBar, ...transaksi]);
    setInputKet('');
    setInputNominal('');
  };

  // FUNGSI: Hapus 1 transaksi berdasarkan id
  const hapusTransaksi = (id) => {
    setTransaksi((prev) => prev.filter((t) => t.id !== id));
  };

  // FUNGSI: Hapus semua transaksi (reset saldo)
  const hapusSemua = () => {
    Alert.alert(
      'Reset Semua Data',
      'Semua transaksi dan saldo akan dihapus. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: () => setTransaksi([]),
        },
      ]
    );
  };

  const saldo = hitungSaldo();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent={false}
        barStyle="light-content"
        backgroundColor="#1565C0"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemTransaksi item={item} onHapus={hapusTransaksi} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Belum ada transaksi.</Text>
              <Text style={styles.emptySubText}>Tambahkan transaksi pertamamu!</Text>
            </View>
          }
          ListHeaderComponent={
            <>
              {/* === HEADER SALDO === */}
              <View style={styles.headerCard}>
                <Text style={styles.headerLabel}>💳  Saldo Saat Ini</Text>
                <Text style={[styles.saldoValue, saldo < 0 && styles.saldoNegatif]}>
                  {saldo < 0 ? '-' : ''}{formatRupiah(saldo)}
                </Text>
                <View style={styles.miniStatsRow}>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniStatLabel}>↑  Pemasukan</Text>
                    <Text style={[styles.miniStatVal, styles.warnaMasuk]}>
                      {formatRupiah(hitungTotalMasuk())}
                    </Text>
                  </View>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniStatLabel}>↓  Pengeluaran</Text>
                    <Text style={[styles.miniStatVal, styles.warnaKeluar]}>
                      {formatRupiah(hitungTotalKeluar())}
                    </Text>
                  </View>
                </View>
              </View>

              {/* === FORM INPUT TRANSAKSI === */}
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>+ Tambah Transaksi</Text>
                <Text style={styles.fieldLabel}>Deskripsi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Beli Makan, Uang Bulanan..."
                  placeholderTextColor="#90A4AE"
                  value={inputKet}
                  onChangeText={setInputKet}
                />
                <Text style={styles.fieldLabel}>Nominal (Rp)</Text>
<TextInput
  style={styles.input}
  placeholder="Contoh: 50.000"
  placeholderTextColor="#90A4AE"
  value={inputNominal}
  onChangeText={(text) => {
    const angkaSaja = text.replace(/[^0-9]/g, '');
    const formatRibuan = angkaSaja.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setInputNominal(formatRibuan);
  }}
  keyboardType="numeric"
/>
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnMasuk]}
                    onPress={() => tambahTransaksi('masuk')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnMasukText}>↑  Pemasukan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnKeluar]}
                    onPress={() => tambahTransaksi('keluar')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnKeluarText}>↓  Pengeluaran</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* === LABEL RIWAYAT + TOMBOL HAPUS SEMUA === */}
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>🕐  Riwayat Transaksi</Text>
                {transaksi.length > 0 && (
                  <TouchableOpacity onPress={hapusSemua} activeOpacity={0.7}>
                    <Text style={styles.btnResetText}>🗑 Reset Semua</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// STYLESHEET
const BIRU = '#1565C0';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    paddingTop: STATUS_BAR_HEIGHT,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },

  // ---- HEADER SALDO ----
  headerCard: {
    backgroundColor: BIRU,
    margin: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 20,
  },
  headerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  saldoValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  saldoNegatif: {
    color: '#FF8A80',
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  miniStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 10,
    padding: 10,
  },
  miniStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 3,
  },
  miniStatVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  warnaMasuk: {
    color: '#69F0AE',
  },
  warnaKeluar: {
    color: '#FF8A80',
  },

  // ---- FORM CARD ----
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#BBDEFB',
  },
  formTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: BIRU,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#546E7A',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F5F9FF',
    borderWidth: 0.5,
    borderColor: '#BBDEFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212121',
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnMasuk: {
    backgroundColor: '#1B5E20',
  },
  btnMasukText: {
    color: '#69F0AE',
    fontWeight: '600',
    fontSize: 13,
  },
  btnKeluar: {
    backgroundColor: '#B71C1C',
  },
  btnKeluarText: {
    color: '#FF8A80',
    fontWeight: '600',
    fontSize: 13,
  },

  // ---- SECTION LABEL + RESET ----
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#546E7A',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  btnResetText: {
    fontSize: 12,
    color: '#C62828',
    fontWeight: '600',
  },

  // ---- ITEM TRANSAKSI ----
  itemContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E3F2FD',
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconMasuk: {
    backgroundColor: 'rgba(27,94,32,0.12)',
  },
  iconKeluar: {
    backgroundColor: 'rgba(183,28,28,0.1)',
  },
  itemIconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconTextMasuk: {
    color: '#2E7D32',
  },
  iconTextKeluar: {
    color: '#C62828',
  },
  itemInfo: {
    flex: 1,
  },
  itemKet: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  itemTipe: {
    fontSize: 12,
    color: '#90A4AE',
    marginTop: 2,
  },
  // Nominal HIJAU jika masuk, MERAH jika keluar
  itemNominal: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  nominalMasuk: {
    color: '#2E7D32', // HIJAU
  },
  nominalKeluar: {
    color: '#C62828', // MERAH
  },

  // Tombol hapus per item (✕)
  btnHapusItem: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(183,28,28,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnHapusItemText: {
    fontSize: 12,
    color: '#C62828',
    fontWeight: '700',
  },

  // ---- EMPTY STATE ----
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#546E7A',
  },
  emptySubText: {
    fontSize: 13,
    color: '#90A4AE',
    marginTop: 4,
  },
});